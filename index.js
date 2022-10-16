import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

const testMdFile = "./another.md";

const parseToHtml = async (filePath) => {
  const readData = await fs.readFileSync(filePath, "utf8");
  const parsedObject = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(readData);
  return String(parsedObject);
};

const createHtmlFile = (lastData) => {
  fs.writeFileSync(
    `./htmls/${testMdFile.replace("md", "html")}`,
    lastData,
    "utf8"
  );
};

const htmlData = await parseToHtml(testMdFile);
try {
  fs.mkdirSync("htmls");
  createHtmlFile(htmlData);
} catch (e) {
  console.log(e.message);
  createHtmlFile(htmlData);
}
