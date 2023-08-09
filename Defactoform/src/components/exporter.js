import React from "react";
import { convertToHTML } from "draft-convert";

import { Inline, Block, Entity } from "../util/constants";
import TextArea from "./controls/textArea";

export const styleToHTML = (style) => {
  switch (style) {
    case Inline.ITALIC:
      return <em className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.BOLD:
      return <strong className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.STRIKETHROUGH:
      return <strike className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.UNDERLINE:
      return <u className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.HIGHLIGHT:
      return <span className={`md-inline-${style.toLowerCase()}`} />;
    case Inline.CODE:
      return <code className={`md-inline-${style.toLowerCase()}`} />;
    default:
      return null;
  }
};

export const blockToHTML = (block) => {
  const blockType = block.type;
  const blockClass = blockType.toLowerCase();

  switch (blockType) {
    case Block.H1:
      return <h1 className={`md-block-${blockClass}`}> </h1>;
    case Block.H2:
      return <h2 className={`md-block-${blockClass}`}> </h2>;
    case Block.H3:
      return <h3 className={`md-block-${blockClass}`}> </h3>;
    case Block.H4:
      return <h4 className={`md-block-${blockClass}`}> </h4>;
    case Block.H5:
      return <h5 className={`md-block-${blockClass}`}> </h5>;
    case Block.H6:
      return <h6 className={`md-block-${blockClass}`}> </h6>;
    case Block.BLOCKQUOTE_CAPTION:
    case Block.CAPTION:
      return {
        start: `<p class="md-block-${blockClass}"><caption>`,
        end: "</caption></p>",
      };
    case Block.IMAGE: {
      const imgData = block.data;
      const text = block.text;
      const extraClass = text.length > 0 ? " md-block-image-has-caption" : "";
      return {
        start: `<figure class="md-block-image${extraClass}"><img src="${
          imgData.src
        }" alt="${block.text}" /><figcaption class="md-block-image-caption">`,
        end: "</figcaption></figure>",
      };
    }
    case Block.ATOMIC:
      const imgData = block.data;
      const text = block.text;
      const extraClass = text.length > 0 ? " md-block-image-has-caption" : "";
      if (block.data.type === "video") {
        let videosrc = imgData.src;
        if (videosrc.includes("watch")) {
          videosrc = videosrc.split("&");
          videosrc = videosrc[0].replace("watch?v=", "embed/");
        }
        return {
          start: `<figure class="md-block-image${extraClass}">
          <iframe type="text/html" width="100%" height="400"
           src=${videosrc}
           frameborder="0" allowFullScreen={true}></iframe>
         <figcaption class="md-block-image-caption">`,
          end: "</figcaption></figure>",
        };
      } else if (block.data.type === "break") {
        return <hr className={`md-block-${blockType}`} />;
      } else if (block.data.type === "related-articles") {
        if (imgData.articles._tail === undefined) {
          return (
            <div>
              <TextArea />
            </div>
          );
        } else {
          let questionData = "";
          let questionDataArr = [];
          for (let i = 0; i < imgData.articles._tail.array.length; i++) {
            // let labelArrData = imgData.articles._tail.array[i];
            questionData = (
              <div key={i} className="field-input">
                {/* <GetFormFields labelData={labelArrData} /> */}
              </div>
            );
            questionDataArr.push(questionData);
          }
          return <div>{questionDataArr}</div>;
        }
      } else {
        // for Image
        let dimensions = JSON.parse(localStorage.getItem("dimensions"));
        let imgStyle = localStorage.getItem("imgStyle");
        imgStyle = imgStyle ? imgStyle.replace("width:", "") : "";
        if (imgStyle.indexOf("float") === -1) {
          imgStyle =
            "position:relative;margin-left: auto; margin-right: auto;display: block;";
        }
        let height = "";
        let width = "";
        if (dimensions) {
          height = dimensions.height;
          width = dimensions.width;
        }
        return {
          start: `<figure class="md-block-image${extraClass}"  style="
          height: 100vh;"><img src="${imgData.src}" alt="${
            block.text
          }" height="${height}" width="${width}"  style="${imgStyle}"/><figcaption class="md-block-image-caption">`,
          end: "</figcaption></figure>",
        };
      }
    case Block.TODO: {
      const checked = block.data.checked || false;
      let inp = "";
      let containerClass = "";
      if (checked) {
        inp = '<input type=checkbox disabled checked="checked" />';
        containerClass = "md-block-todo-checked";
      } else {
        inp = "<input type=checkbox disabled />";
        containerClass = "md-block-todo-unchecked";
      }
      return {
        start: `<div class="md-block-${blockType} ${containerClass}">${inp}<p>`,
        end: "</p></div>",
      };
    }
    case Block.BREAK:
      return <hr className={`md-block-${blockType}`} />;
    case Block.BLOCKQUOTE:
      return <blockquote className={`md-block-${blockType}`} />;
    case Block.OL:
      return {
        element: <li />,
        nest: <ol className={`md-block-${blockType}`} />,
      };
    case Block.UL:
      return {
        element: <li />,
        nest: <ul className={`md-block-${blockType}`} />,
      };
    case Block.UNSTYLED:
      if (block.text.length < 1) {
        return (
          <p className={`md-block-${blockType}`}>
            <br />
          </p>
        );
      }
      return <p className={`md-block-${blockType}`} />;
    case Block.CODE:
      return {
        element: <pre className={`md-block-${blockType}`} />,
        nest: <div className="md-block-code-container" />,
      };
    default:
      return null;
  }
};

export const entityToHTML = (entity, originalText) => {
  if (entity.type === Entity.LINK) {
    return (
      <a
        className="md-inline-link"
        href={entity.data.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {originalText}
      </a>
    );
  }
  return originalText;
};

export const options = {
  styleToHTML,
  blockToHTML,
  entityToHTML,
};

export const setRenderOptions = (htmlOptions = options) =>
  convertToHTML(htmlOptions);

export default (contentState, htmlOptions = options) =>
  convertToHTML(htmlOptions)(contentState);
