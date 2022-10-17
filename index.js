import fs from "fs";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import redirect from "remark-redirect";

const readdir = (dirname) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (error, filenames) => {
      if (error) {
        reject(error);
      } else {
        resolve(filenames);
      }
    });
  });
};

const parseToHtml = async () => {
  try {
    fs.mkdirSync("docs");
  } catch (e) {
    console.log(e.message);
  }

  readdir("./files").then(async (files) => {
    for (let i = 0; i < files.length; i++) {
      const currentFile = files[i];
      const extractedMarkdown = await fs.readFileSync(
        `./files/${currentFile}`,
        "utf8"
      );
      const parsedObject = await unified()
        .use(remarkParse)
        .use(redirect)
        .use(remarkFrontmatter)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypeStringify)
        .process(extractedMarkdown);
      const HtmlData = String(parsedObject);

      fs.writeFileSync(
        `./docs/${currentFile.replace("md", "html")}`,
        HtmlData,
        "utf8"
      );
    }
  });
};

parseToHtml();
