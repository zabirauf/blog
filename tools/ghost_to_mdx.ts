import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

function createMDX(post: any) {
    if (!post.html) {
        // TODO: Currently an error but bypassing to test it out
        console.error(JSON.stringify(post));
        return null;
    }

    const postInfo = {
        html: post.html,
        fileName: `${post.slug}.mdx`,
        title: post.title,
        publishedAt: moment(post.published_at)
    };

    const excerpt = (post.custom_excerpt || post.excerpt)
        .replaceAll('\n', ' ')
        .replaceAll(':', '\x3a')
        .replaceAll('{','\{')
        .replaceAll('}', '\}')
        .replaceAll('>', '\x3e');

    return {
        mdxPage: `---
title: ${postInfo.title.includes("'") ? `"${postInfo.title}"` : `'${postInfo.title}'`}
date: '${postInfo.publishedAt.format("YYYY-MM-DD")}'
tags: [${post.tags.map((tag: any) => tag.name).join(",")}]
draft: false
summary: ${excerpt}
---
<div dangerouslySetInnerHTML={{__html: \`${postInfo.html}\`}} />
`,
        fileName: postInfo.fileName
    };
}

async function toArray(asyncIterator: AsyncGenerator<any, any, any>){ 
    const arr=[]; 
    for await(const i of asyncIterator) arr.push(i); 
    return arr;
}

function getPostApiUrl(ghostApiUrl: string, ghostKey: string, version: string, page: number = 1) {
    return `${ghostApiUrl}/ghost/api/${version}/content/posts?key=${ghostKey}&page=${page}&include=tags&formats=html`;
}

async function* getAllPosts(ghostApiUrl: string, ghostKey: string, version: string) {
    let pageToFetch = 1;

    while (pageToFetch !== null) {
        const postsApiUrl = getPostApiUrl(ghostApiUrl, ghostKey, version, pageToFetch);
        const response = await fetch(postsApiUrl);
        const result = await response.json();

        yield* result.posts;
        pageToFetch = result.meta.pagination.next;
    }
}

async function main([ghostApiUrl, ghostKey, outputFolder, ...otherArgs]: string[]) {
    const VERSION = "v4";
    const allPosts = await toArray(getAllPosts(ghostApiUrl, ghostKey, VERSION));

    const publishedPosts = allPosts
        .filter((post:any) => post.visibility === "public")
        .map(createMDX)
        .filter((post:any) => !!post);

    await Deno.mkdir(outputFolder, { recursive: true });
    await Promise.all(publishedPosts.map((mdxPost:any) => 
        Deno.writeTextFile(`${outputFolder}/${mdxPost.fileName}`, mdxPost.mdxPage)
    ));
}

await main(Deno.args);

