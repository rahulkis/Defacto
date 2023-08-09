export const options = [
  { value: "person", label: "I'm a person" },
  { value: "compamy", label: "I'm representing a company" },
];

export const GDPR = [
  {
    id: 1,
    value: "personalData",
    label: "I want You to delete my personal data.",
  },
  {
    id: 2,
    value: "thirdParty",
    label: "I want you to transfer my data to me or a third party",
  },
  {
    id: 3,
    value: "personalInformation",
    label: "I want to know how you are using my personal information ",
  },
  {
    id: 4,
    value: "rectifyData",
    label: "I want to rectify incorrect data you have about me",
  },
  {
    id: 5,
    value: "marketingProfiling",
    label:
      "I want to stop using my information for dirict marketing and profiling  ",
  },
  {
    id: 6,
    value: "stopProcessing",
    label: "I want you to keep my data but stop processing ",
  },
  {
    id: 7,
    value: "usingPersonalInformation",
    label: "I want to object to the way you are using my personal information",
  },
];
export const moreOptions = [
  {
    label: "Why do you want your data to be deleted?*",
    parentId: "personalData",
    options: [
      {
        id: 1,
        value: "Our compnay no longer has any use for my data",
        label: "Our compnay no longer has any use for my data ",
      },
      {
        id: 2,
        value: "I want to withdraw my consent for processing my data",
        label: "I want to withdraw my consent for processing my data",
      },
      {
        id: 3,
        value: "I believed my data is being used unlawfully",
        label: "I believed my data is being used unlawfully",
      },
      {
        id: 4,
        value: "I want to stop my data from being processed",
        label: "i want to stop my data from being processed",
      },
      {
        id: 5,
        value: "I want to stop my data from being used in direct marketing",
        label: "I want  to stop my data from being used in direct marketing",
      },
      {
        id: 6,
        value: "I want my data to be deleted to comply with a legal order",
        label: "I want my data to be deleted to comply with a legal order",
      },
    ],
  },
  {
    label: "To whom you want to share your data ",
    parentId: "thirdParty",
    options: [
      {
        id: 1,
        value: "mySelf",
        label: "I want to recevie it my self",
      },
      {
        id: 2,
        value: "thirdparty",
        label: "I want to transfet it to a third party",
      },
    ],
  },
  {
    label: "What information would you like to be access",
    parentId: "personalInformation",
    options: [
      {
        id: 1,
        value: "I want to know why you are processing my data",
        label: "I want to know why you are procesing my data",
      },
      {
        id: 2,
        value: "I want to know how you received my personal information ",
        label: "I want to know how you received my personal information",
      },
      {
        id: 3,
        value: "I want to know the types of personal data collected",
        label: "I want to know the types of personal data collected",
      },
      {
        id: 4,
        value: "I want to know all third parties you share my information with",
        label: "I want to know all third parties you share my information with",
      },
      {
        id: 5,
        value:
          "I want to know the duration for which my data will be stored and the reason for that decision",
        label:
          "I want to know the duration for which my data will be stored and the reason for that decision",
      },
      {
        id: 6,
        value: "I want stop my data from being processed",
        label: "I want stop my data from being processed",
      },
      {
        id: 7,
        value: "I want to stop my data from being used in direct marketing",
        label: "I want to stop my data from being used in direct marketing",
      },
      {
        id: 8,
        value:
          "I want to know if any automated decision making or profinling is being done using my personal information",
        label:
          "I want to know if any automated decision making or profinling is being done using my personal information",
      },
    ],
  },
  {
    value: "Describe the incorrect data that we have about you",
    parentId: "stopProcessing",
    options: [
      {
        id: 1,
        value: "I believe the data you have about me is in accurate",
        label: "I believe the data you have about me is in accurate",
      },
      {
        id: 2,
        value: "I believe my information is being used unlawfully",
        label: "I believe my informatin is being used unlawfully",
      },
      {
        id: 3,
        value:
          "There is no further need for my personal information to be used",
        label:
          "There is no further need for my personal information to be used",
      },
      {
        id: 4,
        value:
          "I have a pending complaint and i want you to stop processing my data while this complaint is  pending",
        label:
          "I have a pending complaint and i want you to stop processing my data while this complaint is pending",
      },
    ],
  },
];
