import gql from "graphql-tag";

const baseQueryArgs = `
    $first: Int!
    $page: Int
`;

const baseUsersArgs = `
    first: $first
    page: $page
    orderBy: [{
       field: "id"
       order: DESC
    }]
`;

const usersFields = `
    data {
      id
      name
      email
      avatar {
          id
          copyByType(type: ["icon"]) {
              id
              link
          }
      }
      roles {
          id
          name
      }
      person {
          id
          name
          surname
          phone
      }
    }
    paginatorInfo {
      currentPage
      lastPage
      count
      total
    }
`;

export const queries = {
  catalog(filters) {
    let queryArgs = ``;
    let whereConstraints = ``;

    queryArgs += filters.fulltext ? `$fulltext: Mixed` : ``;

    whereConstraints += filters.fulltext
      ? `
    where: {AND: [
        {column: IS_VISIBLE, value: true}
        {OR: [
            {column: NAME, operator: LIKE, value: $fulltext, functor: LOWER}
            {column: EMAIL, operator: LIKE, value: $fulltext, functor: LOWER}
            {relation: {person: {OR: [
            {column: NAME, operator:LIKE, value: $fulltext, functor: LOWER}
            {column: SURNAME, operator:LIKE, value: $fulltext, functor: LOWER}
            {column: PHONE, operator:LIKE, value: $fulltext}
            ]}}}
        ]}
    ]}
    `
      : `where: {column: IS_VISIBLE, value: true}`;

    return gql`
          query(
            ${baseQueryArgs}
            ${queryArgs}
          ) {
            users(
              ${baseUsersArgs}
              ${whereConstraints}
            ) {
              ${usersFields}
            }
          }
        `;
  }
};

export const mutations = {
  //
};

export const subscriptions = {
  //
};

export default {
  queries,
  mutations,
  subscriptions
};
