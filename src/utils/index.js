/**
 * Function which accepts a DOM node and removes all of its child nodes
 */

export const removeChildNodes = (node) => {
  while (node.firstChild) {
    node.removeChild(node.lastChild);
  }
};

/**
 * Function which accepts a name and return the initials
 */
export const getNameInitials = (name) => {
  const upperCaseName = name.toUpperCase();
  //split the name to get first name, middle name, and last name
  const splitName = upperCaseName.split("");
  if(splitName.length > 0){
    const firstName = splitName[0];
    const lastName = splitName[splitName.length - 1];
     // check if both names are defined
     if(firstName.length > 0 && lastName.length > 0){
      return `${firstName[0]}${lastName[0]}`;
    }
  }

  return null;
}