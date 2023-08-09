import {
  PostData,
  GetData,
  GetDataWithHeader,
  PostDataWithHeader,
  GetDataIntegration,
  PostDataCorsWithBody,
} from "../../src/stores/requests";
import { arrayToObj } from "../../src/util/commonFunction";
import {
  THEME_URLS,
  SQUARE_PAYMENTS,
  STRIPE_PAYMENTS,
  ACTIVE_CAMPAIGNS_URLS,
  MAILER_LITE_URLS,
  CONVERTKIT_API_URLS,
  ASANAUTH_URLS,
  CAMPAIGN_MONITOR_AUTH_URLS,
  HUBSPOT_AUTH_URLS,
  MEISTER_TASK_AUTH_URLS,
  FRESH_DESK_AUTH_URLS,
  MOOSEND_AUTH_URLS ,
  GOTOWEBINAR_AUTH_URLS ,
  CLICKSEND_AUTH_URLS,
  ZENDESK_AUTH_URLS,
  GOOGLEAUTH_URLS,
  GOOGLEAUTH_CRENDENTIALS,
  MAILSHAKEAUTH_URLS
} from "../util/constants";
export const GoogleSheetUpdateRow = (SheetUpdateRowUrl, header, values) => {
  try {
    PostDataWithHeader(SheetUpdateRowUrl, header, {
      values: [values],
    }).then((result) => {
      return "pass";
    });
  } catch (err) {
    return "fail";
  }
};
export async function getAllAutomations(baseurl, APIKey) {
  let objectMap = [];
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/automations",
  };

  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.automations, function(item) {
        return { value: item.id, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}

export async function getAllUsers(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/users",
  };
  let objectMap = [];

  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.users, function(item) {
        return { value: item.id, label: item.email };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}

export async function getAllPipeLine(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/dealGroups",
  };
  let objectMap = [];
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.dealGroups, function(item) {
        return { value: item.id, label: item.title };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}

export async function getAllDealStages(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/dealStages",
  };
  let objectMap = [];
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.dealStages, function(item) {
        return { value: item.id, label: item.title };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getContactList(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/lists",
  };
  let objectMap = [];
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      console.log("lists", result.lists);
      objectMap = arrayToObj(result.lists, function(item) {
        return { value: item.id, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}
export async function getDealGroups(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/dealGroups",
  };
  let objectMap = [];

  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.dealGroups, function(item) {
        return { value: item.id, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getCustomFields(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/fields",
  };
  let objectMap = [];
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.fields, function(item) {
        return { value: item.stringid, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getAllDeals(baseurl, APIKey) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/deals",
  };
  let objectMap = [];
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.deals, function(item) {
        return { value: item.id, label: item.title };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getDealbyId(baseurl, APIKey, dealId) {
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/deals/" + dealId,
  };
  let objectMap = [];
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.ALL_ACTIVE_CAMPAIGN_INFO,
      FormModel
    ).then((result) => {
      if (result != null) {
        return (objectMap = result.deal);
      }
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

//https://youraccountname.api-us1.com/api/3/contact/sync
//https://youraccountname.api-us1.com/api/3/contactAutomations
export async function AddUpdateContact(baseurl, APIKey, emailAddress) {
  let FormModel = {
    APIType: "POST",
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/contact/sync",
    bodyInfo: {
      contact: { email: emailAddress },
    },
  };
  let contactResult;
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.POST_ACTIVE_CAMPAIGNS_API,
      FormModel
    ).then((result) => {
      if (result.errors) {
        contactResult = result.errors[0].title;
      } else {
        contactResult = result.contact.id;
      }
    });
    return contactResult;
  } catch (err) {
    return contactResult;
  }
}

export async function addSubscriberToForm(
  emailAddress,
  name,
  formId,
  APIKey
) {
    try {
      let FormModel = {
        api_secret: APIKey,
        email: emailAddress,
        name: name
      };
      await PostDataCorsWithBody(
        CONVERTKIT_API_URLS.ADD_SUBSCRIBER_TO_FORM_URL+formId+"/subscribe",
        FormModel
      ).then((result) => {
        console.log(result)
        if (result.error) {
          apiresult.status = false;
          apiresult.message = result.message;
        } else if (result.subscription) {
          const res = "Success";
          apiresult.status = true;
          apiresult.message = res;
          apiresult['data'] = result;
        } else {
          result.status = false;
          result.message = "Request failed with status code 403";
        }
      });
      return apiresult;
    } catch (err) {
      console.log(err)
      return apiresult;
    }
}

export async function addSubscriberToTag(
  emailAddress,
  name,
  tagId,
  APIKey
) {
    try {
      let FormModel = {
        api_secret: APIKey,
        email: emailAddress,
        name: name
      };
      await PostDataCorsWithBody(
        CONVERTKIT_API_URLS.ADD_SUBSCRIBER_TO_TAGS_URL+tagId+"/subscribe",
        FormModel
      ).then((result) => {
        console.log(result)
        if (result.error) {
          apiresult.status = false;
          apiresult.message = result.message;
        } else if (result.subscription) {
          const res = "Success";
          apiresult.status = true;
          apiresult.message = res;
          apiresult['data'] = result;
        } else {
          result.status = false;
          result.message = "Request failed with status code 403";
        }
      });
      return apiresult;
    } catch (err) {
      console.log(err)
      return apiresult;
    }
}

export async function addSubscriberToSquence(
  emailAddress,
  name,
  squenceId,
  APIKey
) {
    try {
      let FormModel = {
        api_secret: APIKey,
        email: emailAddress,
        name: name
      };
      await PostDataCorsWithBody(
        CONVERTKIT_API_URLS.ADD_SUBSCRIBER_TO_SQUENCE_URL+squenceId+"/subscribe",
        FormModel
      ).then((result) => {
        console.log(result)
        if (result.error) {
          apiresult.status = false;
          apiresult.message = result.message;
        } else if (result.subscription) {
          const res = "Success";
          apiresult.status = true;
          apiresult.message = res;
          apiresult['data'] = result;
        } else {
          result.status = false;
          result.message = "Request failed with status code 403";
        }
      });
      return apiresult;
    } catch (err) {
      console.log(err)
      return apiresult;
    }
}


export async function AddContact_Automations(
  baseurl,
  APIKey,
  emailAddress,
  automationId
) {
  let res = await AddUpdateContact(baseurl, APIKey, emailAddress);
  if (res > 0) {
    try {
      let FormModel = {
        APIType: "POST",
        headerValue: APIKey,
        HostName: extractHostname(baseurl),
        APIName: "/api/3/contactAutomations",
        bodyInfo: {
          contactAutomation: {
            contact: res,
            automation: automationId,
          },
        },
      };
      await PostData(
        ACTIVE_CAMPAIGNS_URLS.POST_ACTIVE_CAMPAIGNS_API,
        FormModel
      ).then((result) => {
        if (result.errors) {
          res = result.errors[0].title;
          apiresult.status = false;
          apiresult.message = res;
        } else if (result.id) {
          res = "Success";
          apiresult.status = true;
          apiresult.message = res;
        } else {
          result.status = false;
          result.message = "Request failed with status code 403";
        }
      });

      return apiresult;
    } catch (err) {
      return apiresult;
    }
  } else {
    apiresult.status = false;
    apiresult.message = res;
    return apiresult;
  }
}

export const apiresult = {
  status: false,
  message: "",
};

export async function AddContactNote(
  baseurl,
  APIKey,
  contactNote,
  emailAddress
) {
  let res = await AddUpdateContact(baseurl, APIKey, emailAddress);
  if (res > 0) {
    try {
      let FormModel = {
        APIType: "POST",
        headerValue: APIKey,
        HostName: extractHostname(baseurl),
        APIName: "/api/3/notes",
        bodyInfo: {
          note: {
            note: contactNote,
            relid: res,
            reltype: "Subscriber",
          },
        },
      };
      await PostData(
        ACTIVE_CAMPAIGNS_URLS.POST_ACTIVE_CAMPAIGNS_API,
        FormModel
      ).then((result) => {
        if (result.contacts) {
          apiresult.status = true;
          apiresult.message = res;
        } else if (result.errors) {
          res = result.errors[0].title;
          apiresult.status = false;
          apiresult.message = res;
        } else {
          res = "fail";
          apiresult.status = false;
          apiresult.message = res;
        }
      });
      console.log("try");
      return apiresult;
    } catch (err) {
      console.log("catch");
      res = "fail";
      apiresult.status = false;
      apiresult.message = res;
      return apiresult;
    }
  } else {
    apiresult.status = false;
    apiresult.message = res;
    return apiresult;
  }
}

export async function AddUpdateActiveCampaignContact(
  baseurl,
  APIKey,
  emailAddress,
  firstName = "",
  lastName = "",
  phone = "",
  listId = "",
  account = "",
  tag = ""
) {
  let FormModel = {
    APIType: "POST",
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/contact/sync",
    bodyInfo: {
      contact: {
        email: emailAddress,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        listid: listId,
        account: account,
        tag: tag,
      },
    },
  };
  let contactResult;
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.POST_ACTIVE_CAMPAIGNS_API,
      FormModel
    ).then((result) => {
      console.log(result);
      if (result.errors) {
        contactResult = result.errors[0].title;
        apiresult.status = false;
        apiresult.message = contactResult;
      } else {
        contactResult = result.contact.id;
        apiresult.status = true;
        apiresult.message = contactResult;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "fail";
    return apiresult;
  }
}

export async function CreateDeal_ActiveCampaign(
  baseurl,
  APIKey,
  emailAddress,
  title,
  value,
  currency,
  pipeline,
  owner = "",
  stageId,
  groupId
) {
  let contactResult;
  let res = await AddUpdateContact(baseurl, APIKey, emailAddress);
  if (res > 0) {
    let FormModel = {
      APIType: "POST",
      headerValue: APIKey,
      HostName: extractHostname(baseurl),
      APIName: "/api/3/deals",
      bodyInfo: {
        deal: {
          contact: res,
          currency: currency,
          group: groupId,
          owner: owner,
          percent: null,
          stage: stageId,
          status: 0,
          title: title,
          value: value,
        },
      },
    };
    try {
      await PostData(
        ACTIVE_CAMPAIGNS_URLS.POST_ACTIVE_CAMPAIGNS_API,
        FormModel
      ).then((result) => {
        console.log(result);
        if (result.errors) {
          contactResult = result.errors[0].title;
          apiresult.status = false;
          apiresult.message = contactResult;
        } else {
          contactResult = result.contacts[0].id;
          apiresult.status = true;
          apiresult.message = contactResult;
        }
      });
      return apiresult;
    } catch (err) {
      apiresult.status = false;
      apiresult.message = "fail";
      return apiresult;
    }
  } else {
    apiresult.status = false;
    apiresult.message = "fail";
    return apiresult;
  }
}

export async function UpdateDeal_ActiveCampaign(
  baseurl,
  APIKey,
  dealId,
  title,
  value,
  currency,
  pipeline,
  owner = "",
  stageId,
  groupId,
  statusId,
  dealContactId
) {
  let FormModel = {
    APIType: "PUT",
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/3/deals/" + dealId,
    bodyInfo: {
      deal: {
        contact: dealContactId,
        currency: currency,
        group: groupId,
        owner: owner,
        percent: null,
        stage: stageId,
        status: statusId,
        title: title,
        value: value,
      },
    },
  };
  let contactResult;
  try {
    await PostData(
      ACTIVE_CAMPAIGNS_URLS.POST_ACTIVE_CAMPAIGNS_API,
      FormModel
    ).then((result) => {
      console.log(result);
      if (result.errors) {
        contactResult = result.errors[0].title;
        apiresult.status = false;
        apiresult.message = contactResult;
      } else {
        contactResult = result.deal.id;
        apiresult.status = true;
        apiresult.message = contactResult;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "fail";
    return apiresult;
  }
}

export async function getProfileInfoByToken(token) {
  let header = {
    Authorization: "Bearer " + token,
    Accept: "application/json",
  };
  let objectMap = "";

  //https://baljeetckis.api-us1.com/api/3/automations
  try {
    await GetDataWithHeader(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      header
    ).then((result) => {
      objectMap = result.name + "(" + result.email + ")";
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}

export async function getListByToken_mailchimp(token, api_endpoint) {
  let objectMap = {};
  let FormModel = {
    headerValue: "OAuth " + token,
    HostName: extractHostname(api_endpoint),
    APIName: "/3.0/Lists",
  };

  //https://baljeetckis.api-us1.com/api/3/automations
  try {
    await PostData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getlisttokenmailchimp",
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.lists, function(item) {
        return { value: item.id, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}

export async function getAccountByToken_mailchimp(token) {
  let header = {
    Authorization: "OAuth " + token,
    //Accept: "application/json"
  };
  let objectMap = {};
  //https://baljeetckis.api-us1.com/api/3/automations
  try {
    await GetDataIntegration(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmailchimpmetadata",
      header
    ).then((result) => {
      objectMap = {
        accountName: result.accountname,
        api_endpoint: result.api_endpoint,
        email: result.login.email,
      };
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}
export async function getSegmentsBylistId_mailchimp(
  token,
  api_endpoint,
  listId
) {
  let FormModel = {
    headerValue: "OAuth " + token,
    HostName: extractHostname(api_endpoint),
    APIName: "/3.0/lists/" + listId + "/segments",
  };
  let objectMap = {};

  //https://baljeetckis.api-us1.com/api/3/automations
  //api_endpoint+"/3.0/lists/"+listId+"/segments"
  try {
    await PostData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmailchimpsegments",
      FormModel
    ).then((result) => {
      console.log(result);
      objectMap = arrayToObj(result.segments, function(item) {
        return { value: item.id, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
  //return objectMap;
}

export async function createRecordOnZohoCRM(
  token,
  moduleType,
  dataToSubmit,
) {
  let Contactdata = {
    headerValue: "Zoho-oauthtoken " + token,
    APIUrl: "https://www.zohoapis.com/crm/v2/" + moduleType,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postzohocrmapirequest",
      Contactdata
    ).then((result) => {
      console.log(result);
      if (result.statusCode === 200 && result.res.data && result.res.data[0].code === "SUCCESS") {
        result = "success";
        apiresult.status = true;
        apiresult.message = result;
      } else {
        apiresult.status = false;
        apiresult.title = result.title;
        apiresult.message = result.detail;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}

export async function AddSubscriberList_mailchimp(
  token,
  api_endpoint,
  listId,
  emailAddress,
  firstName = "",
  lastName = "",
  phone = "",
  address = "",
  birthday = "",
  status
) {
  // let result;
  let Contactdata = {
    headerValue: "OAuth " + token,
    HostName: extractHostname(api_endpoint),
    APIName: "/3.0/lists/" + listId + "/members",
    bodyInfo: {
      email_address: emailAddress,
      status: status,
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName,
        PHONE: phone,
        ADDRESS: address,
        BDAY: birthday,
      },
    },
  };
  try {
    //await PostDataWithHeader(api_endpoint + "/3.0/lists/"+listId+"/members", header, Contactdata)
    await PostData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addsubscriberlistmailchimp",
      Contactdata
    ).then((result) => {
      if (result.status === "subscribed") {
        result = "success";
        apiresult.status = true;
        apiresult.message = result;
      } else {
        apiresult.status = false;
        apiresult.title = result.title;
        apiresult.message = result.detail;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}

export async function AddSubscriberTag_mailchimp(
  token,
  api_endpoint,
  listId,
  emailAddress,
  segment_id
) {
  // let result;
  let Contactdata = {
    headerValue: "OAuth " + token,
    HostName: extractHostname(api_endpoint),
    APIName: "/3.0/lists/" + listId + "/segments/" + segment_id + "/members",
    bodyInfo: {
      email_address: emailAddress,
    },
  };
  //api_endpoint + "/3.0/lists/"+listId+"/segments/"+segment_id+"/members"
  try {
    await PostData(
      "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addsubscriberlistmailchimp",
      Contactdata
    ).then((result) => {
      if (result.status === "subscribed") {
        result = "success";
        apiresult.status = true;
        apiresult.message = result;
      } else {
        result = result.detail;
        apiresult.status = false;
        apiresult.message = result;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}

export function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

export async function getAccountDetailByToken_Square(token) {
  let header = {
    headerValue: "Bearer " + token,
    HostName: SQUARE_PAYMENTS.HOSTNAME,
    APIName: "/v2/locations",
  };
  let objectMap = {};
  try {
    await PostData(
      SQUARE_PAYMENTS.GET_ACCOUNT_DETAILS_BY_TOKEN_URL,
      header
    ).then((result) => {
      objectMap = {
        locationName: result.locations[0].name,
        locations: JSON.stringify(result.locations),
      };
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getAccountDetailByToken_Stripe(token, stripeId) {
  let header = {
    headerValue: "Bearer " + token,
    HostName: STRIPE_PAYMENTS.HOSTNAME,
    APIName: "/v1/accounts/" + stripeId,
  };
  let objectMap = {};
  try {
    await PostData(
      STRIPE_PAYMENTS.GET_ACCOUNT_DETAILS_BY_TOKEN_URL,
      header
    ).then((result) => {
      objectMap = {
        UserName: result.business_profile.name,
        UserInfo: JSON.stringify(result),
      };
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getThemeSearchForms(userId) {
  let objectMap = [];
  try {
    await GetData(THEME_URLS.GET_FORM_LIST_URLS + userId).then((result) => {
      if (result != null) {
        return (objectMap = result.Items);
      }
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getThemeInfoByFormId(formId) {
  let objectMap = [];
  try {
    await GetData(THEME_URLS.GET_THEME_INFO_BY_FORMID + formId).then(
      (result) => {
        if (result != null) {
          return (objectMap = result);
        }
      }
    );
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

// Start MailerLite
export async function getMailerLiteAllGroups(baseurl, APIKey) {
  let objectMap = [];
  let FormModel = {
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/v2/groups",
  };

  try {
    await PostData(
      MAILER_LITE_URLS.GET_MAILER_LITE_INFO,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.response, function(item) {
        return { value: item.id, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function AddSubsciber_MailerLite(
  baseurl,
  APIKey,
  emailAddress,
  Name = "",
  lastName = "",
  country="",
  city = "",
  phone = "",
  state = "",
  zip = ""
) {
  let FormModel = {
    APIType: "POST",
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/v2/subscribers",
    bodyInfo: {
      email:emailAddress,
      name:Name,
      fields:{
        last_name:lastName,
        country:country,
        city:city,
        phone:phone,
        state:state,
        zip:zip
      }
    },
  };
  let resultInfo;
  try {
    await PostData(
      MAILER_LITE_URLS.POST_MAILER_LITE_INFO,
      FormModel
    ).then((result) => {
      console.log(result);
      if (result.response.error) {
        resultInfo = result.response.error.message;
        apiresult.status = false;
        apiresult.message = resultInfo;
      } else {
        resultInfo = result.response.id;
        apiresult.status = true;
        apiresult.message = resultInfo;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "fail";
    return apiresult;
  }
}

export async function AddSubsciberGroup_MailerLite(
  baseurl,
  APIKey,
  emailAddress,
  GroupId,
  Name = "",
  lastName = "",
  country="",
  city = "",
  phone = "",
  state = "",
  zip = "",
  
) {
  let FormModel = {
    APIType: "POST",
    headerValue: APIKey,
    HostName: extractHostname(baseurl),
    APIName: "/api/v2/groups/"+ GroupId + "/subscribers",
    bodyInfo: {
      email:emailAddress,
      name:Name,
      fields:{
        last_name:lastName,
        country:country,
        city:city,
        phone:phone,
        state:state,
        zip:zip
      }
    },
  };
  let resultInfo;
  try {
    await PostData(
      MAILER_LITE_URLS.POST_MAILER_LITE_INFO,
      FormModel
    ).then((result) => {
      console.log(result);
      if (result.response.error) {
        resultInfo = result.response.error.message;
        apiresult.status = false;
        apiresult.message = resultInfo;
      } else {
        resultInfo = result.response.id;
        apiresult.status = true;
        apiresult.message = resultInfo;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "fail";
    return apiresult;
  }
}

// End MailerLite
// ASANA
export async function getAsanaWorkSpaceList(baseurl, accessToken) {
  let objectMap = [];
  let FormModel = {
    headerValue: "Bearer " + accessToken,
    HostName: extractHostname(baseurl),
    APIName: "/api/1.0/workspaces",
  };

  try {
    await PostData(
      ASANAUTH_URLS.GET_API,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.data, function(item) {
        return { value: item.gid, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}
export async function getAsanaProjectList(baseurl, accessToken) {
  let objectMap = [];
  let FormModel = {
    headerValue: "Bearer " + accessToken,
    HostName: extractHostname(baseurl),
    APIName: "/api/1.0/projects",
  };

  try {
    await PostData(
      ASANAUTH_URLS.GET_API,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.data, function(item) {
        return { value: item.gid, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getAsanaSectionList(baseurl, accessToken,projectId) {
  let objectMap = [];
  let FormModel = {
    headerValue: "Bearer " + accessToken,
    HostName: extractHostname(baseurl),
    APIName: "/api/1.0/projects/"+ projectId +"/sections",
  };

  try {
    await PostData(
      ASANAUTH_URLS.GET_API,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.data, function(item) {
        return { value: item.gid, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getAsanaParentList(baseurl, accessToken,projectId) {
  let objectMap = [];
  let FormModel = {
    headerValue: "Bearer " + accessToken,
    HostName: extractHostname(baseurl),
    APIName: "/api/1.0/projects/"+ projectId +"/tasks",
  };

  try {
    await PostData(
      ASANAUTH_URLS.GET_API,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(result.data, function(item) {
        return { value: item.gid, label: item.name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function Create_Asana_Task(
  token,
  api_endpoint,
  taskName,
  taskNotes,
  parentId,
  projectId,
  workspaceId  
) {
  // let result;
  let taskdata = {};
  if (parentId === undefined)
  {
    taskdata={
    headerValue: "Bearer " + token,
    APIUrl: api_endpoint + "api/1.0/tasks",
    bodyInfo: {
        "data": {
          "name": taskName,
          "notes": taskNotes,
          "projects":projectId,
          "workspace": workspaceId
        }
      } 
    }   
  }
  else{
    taskdata={
      headerValue: "Bearer " + token,
      APIUrl: api_endpoint + "api/1.0/tasks",
      bodyInfo: {
          "data": {
            "name": taskName,
            "notes": taskNotes,
            "parent":parentId,
            "projects":projectId,
            "workspace": workspaceId
          }
        } 
      }
  }
  try {
    await PostData(
      ASANAUTH_URLS.POST_URL,
      taskdata
    ).then((result) => {
      if (result.statusCode === 200) {
        result = result.res.data.gid;
        apiresult.status = true;
        apiresult.message = result;
      } else {
        result = result.res.errors[0].message;
        apiresult.status = false;
        apiresult.message = result;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}

export async function Add_Asana_Task_ToSection(
  token,
  api_endpoint,
  taskId,
  sectionId
) {
  // let result;
  let taskdata = {
    headerValue: "Bearer " + token,
    APIUrl: api_endpoint + "api/1.0/sections/"+ sectionId + "/addTask",
    bodyInfo: {
        "data": {
          "task": taskId
        }
      } 
    }  

  try {
    await PostData(
      ASANAUTH_URLS.POST_URL,
      taskdata
    ).then((result) => {
      if (result.statusCode === 200) {
        result = "success";
        apiresult.status = true;
        apiresult.message = result;
      } else {
        result = result.res.errors[0].message;
        apiresult.status = false;
        apiresult.message = result;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
// End

// Campaign Monitor
export async function getCampaignMonitorClientList(baseurl, accessToken) {
  let objectMap = [];
  let FormModel = {
    headerValue: "Bearer " + accessToken,
    APIUrl: baseurl + "api/v3.2/clients.json?pretty=true",
  };

  try {
    await PostData(
      CAMPAIGN_MONITOR_AUTH_URLS.GET_API,
      FormModel
    ).then((result) => {
      if(result.res.length > 0)
      {
      objectMap = arrayToObj(JSON.parse(result.res), function(item) {
        return { value: item.ClientID, label: item.Name };
      });
      }
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function getCampaignMonitorSubscriberList(baseurl, accessToken,clientid) {
  let objectMap = [];
  let FormModel = {
    headerValue: "Bearer " + accessToken,
    APIUrl: baseurl + "api/v3.2/clients/" + clientid + "/lists.json",
  };
  try {
    await PostData(
      CAMPAIGN_MONITOR_AUTH_URLS.GET_API,
      FormModel
    ).then((result) => {
      objectMap = arrayToObj(JSON.parse(result.res), function(item) {
        return { value: item.ListID, label: item.Name };
      });
    });
    return objectMap;
  } catch (err) {
    return objectMap;
  }
}

export async function AddUpdateCampaignMonitor(
  token,
  listId,
  dataToSubmit,
) {
  let formdata = {
    headerValue: "Bearer " + token,
    APIUrl: "https://api.createsend.com/api/v3.2/subscribers/"+ listId +".json",
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      CAMPAIGN_MONITOR_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      console.log(result);
      if (result.statusCode === 200) {
        result = "success";
        apiresult.status = true;
        apiresult.message = result.res;
      } else {
        result = "failed";
        apiresult.status = false;
        apiresult.message = result.res;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}


// End Campaign Monitor

// Hub Spot
export async function AddUpdateContactHubSpot(
  token,
  emailAddress,
  dataToSubmit,
) {
  
  let formdata = {
    headerValue: "Bearer " + token,
    APIUrl: HUBSPOT_AUTH_URLS.BASE_URL + "contacts/v1/contact/createOrUpdate/email/"+ emailAddress,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      HUBSPOT_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      
      if (result.statusCode === 200) {
        result = "success";
        apiresult.status = true;
        apiresult.message = result.res;
      } else {
        result = "failed";
        apiresult.status = false;
        apiresult.message = result.res;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//End Hub Spot

// Meistertask
export async function AddNewMeisterTask(
  token,
  sectionId,
  dataToSubmit,
) {
  let formdata = {
    headerValue: "Bearer " + token,
    APIUrl: MEISTER_TASK_AUTH_URLS.GET_BASE_URL + "api/sections/"+sectionId+"/tasks",
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      MEISTER_TASK_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
        result = "success";
        apiresult.status = true;
        apiresult.message = result.res;
      } else {
        result = "failed";
        apiresult.status = false;
        apiresult.message = result.res;
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//End Meistertask

// Freshdesk
export async function CheckEmailExistFreshdesk(formModel) {
  let contactResult;
  try {
    await PostData(
      FRESH_DESK_AUTH_URLS.GET_API,
      formModel
    ).then((result) => {
      if (result.statusCode === 200) {
        result= JSON.parse(result.res);
        if (result.total === 1) {
        contactResult = result.results[0].id;
      } else {
        contactResult = 0;
      }
    }
    });
    return contactResult;
  } catch (err) {
    contactResult = -1;
    return contactResult;
  }
}

export async function AddNewFreshDeskContent(
  token,
  apiURL,
  apiType,
  dataToSubmit,
) {
  let formdata = {
    headerValue: token,
    APIUrl: apiURL,
    APIType:apiType,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      FRESH_DESK_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
      if (result.res.errors !== undefined) {
        result = result.res.description;
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//End Freshdesk

// Moosend
export async function AddUpdateSubscriberMoosend(
  apiToken,
  listId,
  dataToSubmit,
) {
  let formdata = {
    APIUrl: "https://api.moosend.com/v3/subscribers/"+listId+"/subscribe.json?apikey="+apiToken,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      MOOSEND_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
      if (result.res.Error !== null) {
        result = result.res.Error;
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result.res.Context;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//End Moosend

// GoToWebinar
export async function CreateRegistrantGoToWebinar(
  token,
  organizerKey,
  webinarKey,
  dataToSubmit,
) {
  let formdata = {
    headerValue: "Bearer " + token,
    APIUrl: "https://api.getgo.com/G2W/rest/v2/organizers/"+organizerKey+"/webinars/"+webinarKey+"/registrants",
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      GOTOWEBINAR_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
      if (result.res.errorCode !== undefined) {
        result = result.res.errorCode;
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}

export async function CreateWebinarGoToWebinar(
  token,
  organizerKey,
  dataToSubmit,
) {
  let formdata = {
    headerValue: "Bearer " + token,
    APIUrl:"https://api.getgo.com/G2W/rest/v2/organizers/"+ organizerKey + "/webinars",
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      MEISTER_TASK_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
      if (result.res.errorCode !== undefined) {
        result = result.res.errorCode;
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//End GoToWebinar

// Click Send
export async function PostClickSendRequest(
  token,
  APIURL,
  dataToSubmit,
) {
  let formdata = {
    headerValue: token,
    APIUrl:APIURL,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      CLICKSEND_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
      if (result.res.http_code !== 200) {
        result = result.res.response_msg;
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//Click Send

// Zendesk

export async function AddZendeskNewUser(token,
  APIURL,
  dataToSubmit) {
    let formdata = {
      headerValue: token,
      APIUrl:APIURL,
      bodyInfo: dataToSubmit,
    };
  let userId = "";
  debugger;
  try {
    await PostData(
      ZENDESK_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
     debugger;
     if(result.statusCode === 200)
     {
       if(result.res.error !== undefined && result.res.error !=="")
       {
         userId = 0;
       }
       else{
         userId=result.res.user.id;
       }
     }
    });
    return userId;
  } catch (err) {
    return userId;
  }
}

export async function PostZendeskRequest(
  token,
  APIURL,
  dataToSubmit,
) {
  let formdata = {
    headerValue: token,
    APIUrl:APIURL,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      ZENDESK_AUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
        if(result.res.error !== undefined && result.res.error !==""){
        result = result.res.error;
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
//Zendesk

// Mailshake
export async function PostMailshakeRequest(
  token,
  APIURL,
  dataToSubmit,
) {
  let formdata = {
    headerValue: token,
    APIUrl:APIURL,
    bodyInfo: dataToSubmit,
  };
  try {
    await PostData(
      MAILSHAKEAUTH_URLS.POST_API,
      formdata
    ).then((result) => {
      if (result.statusCode === 200) {
        debugger;
        if(!result.res.isEmpty){
        result = "Invalid";
        apiresult.status = false;
        apiresult.message = result;
      } else  {
        result = "Success";
        apiresult.status = true;
        apiresult.message = result;
      }
     } 
     else {
        apiresult.status = false;
        apiresult.message = "Request failed with status code 403";
      }
    });
    return apiresult;
  } catch (err) {
    apiresult.status = false;
    apiresult.message = "";
    return apiresult;
  }
}
// Mailshake

export async function getGoogleAccessTokenByRefreshToken(refreshtoken) {

  const grant_type = "refresh_token";
  const client_id = GOOGLEAUTH_CRENDENTIALS.CLIENT_ID;
  const client_secret = GOOGLEAUTH_CRENDENTIALS.CLIENT_SECRET;
  const formData = new FormData();
  formData.append("grant_type", grant_type);
  formData.append("refresh_token", refreshtoken);
  formData.append("client_id", client_id);
  formData.append("client_secret", client_secret);
  let headers = "";
  await fetch(GOOGLEAUTH_URLS.GET_GOOGLEAUTHTOKEN, {
    method: "POST",
    body: formData,
  }).then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        console.log(res.statusText);
      }
    })
    .then((json) => {
      headers = {
        Authorization: "Bearer " + json.access_token,
        Accept: "application/json",
      };
      
    });
    return headers;
};