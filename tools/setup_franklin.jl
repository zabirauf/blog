using Pkg;
Pkg.add([
Pkg.PackageSpec(name="NodeJS", version="1.1.1"),
Pkg.PackageSpec(name="JSON", version="0.21.1"),
Pkg.PackageSpec(name="Franklin", version="0.10.28"),
]);
using NodeJS;

"== Run Franklin ==";
cd("website");

run(`$(npm_cmd()) install highlight.js`);
using Franklin;
optimize(;minify=false);

"== Place rendered notebooks in the website folder ==";
cp("../notebooks", "__site/notebooks");

"== Extra website config files ==";
write("__site/CNAME", "interactive.zohaib.me");