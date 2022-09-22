import { getNameInitials, removeChildNodes } from "../utils";

/**
 * Function which compares two strings
 *
 * @param {string} a first string to compare
 * @param {string} b second string to compare
 * @return {int} integer denoting which of the string is alphabetically bigger
 */
const compareStrings = (a, b) => {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
}

/**
 * Function which is a custom compare as the list needs to be sorted by last names. 
 *
 * @param {object} a first friend to compare
 * @param {object} b second friend to compare
 * @return {int} integer denoting which of the friend last name is alphabetically bigger
 */
const customCompare = (a, b) => {
  // split on space to get first, middle, and last name separated
  const splitA = a.name.split(" ");
  const splitB = b.name.split(" ");
  // get the value (last name) which is located at last index
  const lastA = splitA[splitA.length - 1];
  const lastB = splitB[splitB.length - 1];

  // if both last names are same, then use first name to sort alphabetically else use last name
  return lastA === lastB ?
    compareStrings(splitA[0], splitB[0]) :
    compareStrings(lastA, lastB);
}

const sortFriendsList= (friendsList) => {
  // top friends 
  const topFriends = friendsList.filter((friend) => friend?.topFriend);
  // all other friends who are not top friends
  const otherFriends = friendsList.filter((friend) => !friend?.topFriend);
  // sort by last name using custom compare
  const otherFriendsSortByLastName = (otherFriends || []).sort(customCompare);
  //merging both of the list
  return [...topFriends, ...otherFriendsSortByLastName];
}

/**
 * Function which generates a single list-item node based on a dataset
 *
 * @param {object} data data containing attributes of a listItem
 * @return {Node} generated markup for a card
 */
const generateListItemNode = (data) => {
  const { avatarSrc, name, jobTitle, companyName, topFriend } = data;
  const templateId = "friend-list-item-template";
  const resultCardTemplate = document.getElementById(templateId);
  const clone = document.importNode(resultCardTemplate.content, true);
  const nameNode = clone.querySelector("p.page-paragraph");
  const titleNode = clone.querySelector("p.page-micro");
  const avatarNode = clone.querySelector(".profile-list-item-avatar");
  const topFriendNode = clone.querySelector("p.top-friend-flag");

  nameNode.innerHTML = `${name}`;
  titleNode.innerHTML = `${jobTitle} @ ${companyName}`;
  avatarNode.src = avatarSrc;
  avatarNode.setAttribute("aria-label", `${name}`);

  if (avatarSrc) {
    const avatarImg = document.createElement("img");
    avatarImg.src = avatarSrc;
    avatarImg.setAttribute("aria-label", `${name}`);
    avatarNode.appendChild(avatarImg);
  }
  
  else{
    const initials = getNameInitials(name);
    // check if initials are defined
    if(initials){
      const initialsParagraph = document.createElement("p");
      initialsParagraph.innerHTML = initials;
      avatarNode.appendChild(initialsParagraph);
    }
  }

  // if the friend is a top friend then set property of display to block from none to show visual indicator
  // topFriendNode is always defined so not checking for null in this case
  if(topFriend){
    topFriendNode.style.display = "block";
  }
  return clone;
};

/**
 * Function which accepts the JSON results from the API, and uses HTML templates
 * to generate the markup needed for the results list
 *
 * @param {object} resultsData JSON payload of results
 */
export const generateFriendsListFromTemplate = (resultsData) => {
  const friendsListSection = document.querySelector(
    "#profile-friends .profile-friends-list"
  );

  if (resultsData.friends && resultsData.friends.length > 0) {
    removeChildNodes(friendsListSection);
    const friends = sortFriendsList(resultsData.friends);
    for (let i = 0; i < friends.length; i++) {
      const friendsNode = generateListItemNode(friends[i]);
      friendsListSection.appendChild(friendsNode);
    }
  }
};
