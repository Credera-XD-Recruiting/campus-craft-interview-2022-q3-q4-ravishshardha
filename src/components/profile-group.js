import { removeChildNodes } from "../utils";
import group_favorite from  "../assets/group_favorite.png";

const activityStates = {
  active: "active",
  inactive: "inactive",
  moderate: "moderate",
  low: "low",
};

const colors = {
  active:  "#52C1AD",
  inactive: "#C4C4C4",
  moderate: "#58B1C9",
  low: "#C152A2",
};

/**
 * Function which returns background color based on group activity
 *
 * @param {string} activity activity of the group
 * @return {string} color for the group activity
 */
const getBackgroundColorBasedOnGroupActivity = (activity) => {
  switch(activity){
    case activityStates.active:
      return colors.active;
    
    case activityStates.moderate:
      return colors.moderate;

    case activityStates.low:
      return colors.low;

    default:
      return colors.inactive;
  }
}

/**
 * Function which generates a single Card node based on a dataset
 *
 * @param {object} data data containing attributes of a card
 * @return {Node} generated markup for a card
 */
const generateCardNode = (data) => {
  const { name, href, image, activity, favorite } = data;
  const templateId = "profile-group-results-item-template";
  const resultCardTemplate = document.getElementById(templateId);
  const clone = document.importNode(resultCardTemplate.content, true);
  const titleNode = clone.querySelector("p.page-paragraph");
  const referenceNode = clone.querySelector("a.profile-group-results-card");
  const groupImageNode = clone.querySelector(
    "a.profile-group-results-card img"
  );

  titleNode.innerHTML = `${name}`;
  referenceNode.href = href;
  groupImageNode.src = image;
  // favorite group then add visual indicator
  if(favorite){
    const avatarNode = clone.querySelector("div.profile-group-avatar");
    const avatarImg = document.createElement("img");
    avatarImg.setAttribute("alt", "favorite group");
    avatarImg.classList.add("favorite-group");
    avatarImg.src = group_favorite;
    avatarNode.appendChild(avatarImg);
  }

  // update the background color of the card based on group activity
  referenceNode.style.backgroundColor = getBackgroundColorBasedOnGroupActivity(activity);

  return clone;
};

/**
 * Function which accepts the JSON results from the API, and uses HTML templates
 * to generate the markup needed for the results list
 *
 * @param {object} resultsData JSON payload of results
 */
export const generateProfileGroupItemsFromTemplate = (resultsData) => {
  const profileGroupsList = document.querySelector(
    "#profile-groups .profile-group-results"
  );

  removeChildNodes(profileGroupsList);

  if (resultsData.groups && resultsData.groups.length > 0) {
    for (let i = 0; i < resultsData.groups.length; i++) {
      const groupNode = generateCardNode(resultsData.groups[i]);
      profileGroupsList.appendChild(groupNode);
    }
  }
};
