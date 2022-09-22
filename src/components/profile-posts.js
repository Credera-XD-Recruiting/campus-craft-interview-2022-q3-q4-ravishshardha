import { removeChildNodes, getNameInitials } from "../utils";

const cssClasses = {
  showClass: "show",
  hideClass: "hide"
};

const showMore = "Show more";
const showLess = "Show less";

/**
 * Function which updates classes of node to animate toggle for accordion
 *
 * @param {Node} postNode node whose classes will be updated
 * @param {Node} postButton button whose text will be updated
 */
const handlePostOnClick = (postNode, postButton) => {
  if (postNode) {
    if (postNode.classList.contains(cssClasses.showClass)) {
      postNode.classList.remove(cssClasses.showClass);
      postNode.classList.add(cssClasses.hideClass);
      postButton.innerHTML = showMore;
    } else if (postNode.classList.contains(cssClasses.hideClass)) {
      postNode.classList.remove(cssClasses.hideClass);
      postNode.classList.add(cssClasses.showClass);
      postButton.innerHTML = showLess;
    }
  }
}

/**
 * Function which creates a single paragraph tag, fills it with content, and returns the paragraph tag 
 *
 * @param {string} content content of the paragraph tag
 * @return {Node} paragraph tag
 */
const createAndGetParagraphTag = (content) => {
  const pTag = document.createElement("p");
  pTag.innerHTML = content;
  pTag.classList.add("page-micro");
  return pTag;
}

/**
 * Function which generates a single Card node based on a dataset
 *
 * @param {object} data data containing attributes of a card
 * @return {Node} generated markup for a card
 */
const generateCardNode = (data) => {
  const {
    authorFirstName,
    authorLastName,
    authorAvatarSrc,
    jobTitle,
    companyName,
    post,
    publishDate,
    city,
    state
  } = data;
  const templateId = "profile-post-item-template";
  const resultCardTemplate = document.getElementById(templateId);
  const clone = document.importNode(resultCardTemplate.content, true);
  const authorInfoNode = clone.querySelector(".post-author-info");
  const authorName = clone.querySelector(".post-author-info .page-paragraph");
  const jobDesc = clone.querySelector(".post-author-info .page-micro");
  const postNode = clone.querySelector(".post-content");
  const avatarNode = clone.querySelector(".post-author-avatar");

  const name = `${authorFirstName} ${authorLastName}`;
  authorName.innerHTML = name;
  jobDesc.innerHTML = `${jobTitle} @ ${companyName}`;
  postNode.innerHTML = post;

  //hide the post by default
  postNode.classList.add(cssClasses.hideClass);
  // accordion for posts
  const toggleButton = document.createElement("button");
  toggleButton.innerHTML = showMore;
  toggleButton.addEventListener('click', () => handlePostOnClick(postNode, toggleButton));
  authorInfoNode.appendChild(toggleButton);

  if (authorAvatarSrc) {
    const avatarImg = document.createElement("img");
    avatarImg.src = authorAvatarSrc;
    avatarImg.setAttribute(
      "aria-label",
      name
    );
    avatarNode.appendChild(avatarImg);
  }

  else {
    const initials = getNameInitials(name);
    // check if initials are defined
    if (initials) {
      const initialsParagraph = document.createElement("p");
      initialsParagraph.innerHTML = initials;
      avatarNode.appendChild(initialsParagraph);
    }
  }

  // checking if job description node is defined as we are rendering publish date and location information after job description
  if (jobDesc) {
    jobDesc.appendChild(createAndGetParagraphTag(publishDate));
    jobDesc.appendChild(createAndGetParagraphTag(`${city}, ${state}`));
  }

  return clone;
};

/**
 * Function which accepts the JSON results from the API, and uses HTML templates
 * to generate the markup needed for the results list
 *
 * @param {object} resultsData JSON payload of results
 */
export const generatePinnedPostsFromTemplate = (resultsData) => {
  const pinnedPostsList = document.querySelector(
    "#profile-posts .profile-post-results"
  );

  removeChildNodes(pinnedPostsList);

  if (resultsData.pinnedPost) {
    const postNode = generateCardNode(resultsData.pinnedPost);
    pinnedPostsList.appendChild(postNode);
  }
};
