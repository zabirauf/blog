import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

function createMDX(post: any) {
    if (!post.mobiledoc.cards[0][1].markdown) {
        // TODO: Currently an error but bypassing to test it out
        console.log(JSON.stringify(post));
        return null;
    }

    const postInfo = {
        markdown: post.mobiledoc.cards[0][1].markdown.replace('__GHOST_URL__', '').replace(/\\\\/g, '\\'),
        fileName: `${post.slug}.mdx`,
        title: post.title,
        publishedAt: moment(post.published_at)
    };

    return {
        mdxPage: `---
title: ${postInfo.title.includes("'") ? `"${postInfo.title}"` : `'${postInfo.title}'`}
date: '${postInfo.publishedAt.format("YYYY-MM-DD")}'
tags: []
draft: false
---
${postInfo.markdown}
`,
        fileName: postInfo.fileName
    };
}

async function main([ghostFile, outputFolder, ...otherArgs]: string[]) {
    const file = await Deno.readTextFile(ghostFile);
    const parsedFile = JSON.parse(file);

    const publishedPosts = parsedFile.db
        .map((db:any) => db.data.posts.filter((post:any) => post.status === "published"))
        .flat()
        .map((post:any) => {
            post.mobiledoc = JSON.parse(post.mobiledoc);
            return post
        })
        .map(createMDX)
        .filter((post:any) => !!post);

    await Deno.mkdir(outputFolder, { recursive: true });
    await Promise.all(publishedPosts.map((mdxPost:any) => 
        Deno.writeTextFile(`${outputFolder}/${mdxPost.fileName}`, mdxPost.mdxPage)
    ));
}

await main(Deno.args);

