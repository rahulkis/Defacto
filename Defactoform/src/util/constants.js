export const Block = {
  UNSTYLED: "unstyled",
  PARAGRAPH: "unstyled",
  OL: "ordered-list-item",
  UL: "unordered-list-item",
  H1: "header-one",
  H2: "header-two",
  H3: "header-three",
  H4: "header-four",
  H5: "header-five",
  H6: "header-six",
  CODE: "code-block",
  BLOCKQUOTE: "blockquote",
  PULLQUOTE: "pullquote",
  ATOMIC: "atomic",
  BLOCKQUOTE_CAPTION: "block-quote-caption",
  CAPTION: "caption",
  TODO: "todo",
  IMAGE: "atomic:image",
  BREAK: "atomic:break",
};

export const Inline = {
  BOLD: "BOLD",
  CODE: "CODE",
  ITALIC: "ITALIC",
  STRIKETHROUGH: "STRIKETHROUGH",
  UNDERLINE: "UNDERLINE",
  HIGHLIGHT: "HIGHLIGHT",
};

export const Entity = {
  LINK: "LINK",
};

export const PLUGIN_TYPE = "related-articles";

export const HYPERLINK = "hyperlink";
export const HANDLED = "handled";
export const NOT_HANDLED = "not_handled";

export const KEY_COMMANDS = {
  addNewBlock: () => "add-new-block",
  changeType: (type = "") => `changetype:${type}`,
  showLinkInput: () => "showlinkinput",
  unlink: () => "unlink",
  toggleInline: (type = "") => `toggleinline:${type}`,
  deleteBlock: () => "delete-block",
};

export default {
  Block,
  Inline,
  Entity,
};

export const EMAIL_URLS = {
  GET_EMAILS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getemails/",
  POST_EMAIL_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postemail",
  DELETE_EMAIL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletemail/",
  UPDATE_EMAIL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateemail",
};
export const SUCCESS_N_REDIRECTS_PAGE_URLS = {
  POST_DEFAULT_PAGE_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/adddefaultpage",
  GET_DEFAULT_PAGE_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/defaultpage/",
  GET_ALL_SUCCESS_PAGES_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getpages/",
  ADD_DYNAMIC_PAGE_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addpage",
  UPDATE_DYNAMIC_PAGE_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatepage",
  GET_DYNAMIC__URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getpage/",
  DELETE_PAGE_BY_ID_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletepagebyid/",
};
export const FORM_ANALYTICS_URLS = {
  GET_FORM_ANALYTICS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/formanalytics/",
  POST_FORM_ANALYTICS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/formanalytics",
};

export const FORM_DETAILS_URLS = {
  GET_FORM_DETAILS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getdetails/",
  POST_FORM_DETAILS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postdetails",
  UPDATE_FORM_DETAILS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatedetail",
  CHECK_FORM_URL_AVALILABILITY:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/checkurlavailability/",
};
export const FORM_URLS = {
  POST_FORM:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postform",
  UPDATE_FORM_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateform",
  SUBMIT_FORM:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/submitform",
  GET_ALL_FORMS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getformsloginuser/",
  GET_FORM_BY_ID_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/form/",
  SEARCH_FORM_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/searchform/",
  UPDATE_TAGS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateformtags",
  ADD_FORM_TRACK_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/trackform",
  GET_FORM_TRACK_DETAILSURL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/trackform/",
  UPDATE_TIMING:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatecontrol",
  GET_FORM_BY_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getformbyformurl/",
  GET_USER_VERIFIED_FORM_ID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getuserverifiedfromformid/",
  GET_SELECTED_TRANSLATION_FORM_ID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getselectedtranslationformId/",
  GET_WORK_SHEET_SETUP_FORM_ID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getworksheetsetupbyformid/",
};

export const FORM_BEHAVIOUR_URLS = {
  GET_FORM_BEHAVIOUR_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getformbehaviour/",
  POST_FORM_BEHAVIOUR_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postformbehaviour",
};
export const CONFIGURE_PAYMENTS_URLS = {
  GET_PAYMENT_CONFIGURATION_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/paymentconfiguration/",
  POST_PAYMENT_CONFIGURATION_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/paymentconfiguration",
};

export const AFTER_SUBMISSION_DATA = {
  SUBMISSION_TITLE: "Submission successful",
  SUBMISSION_DESCRIPTION: "Thanks! We have received your submission.",
  INCLUDE_SUBMIT_ANOTHER: false,
  REDIRECT_ENABLE: false,
  SUCCESS_PAGE_N_REDIRECTS: false,
};

export const CONFIGURATION = {
  CONFIGURATION_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/configuration/",
};
export const ORDER_BY_OPTIONS = [
  { id: 1, value: 1, label: "Age(Oldest First)" },
  { id: 2, value: 2, label: "Age(Newest First)" },
  // {id:3,value:3, label:"Title(A-Z)"}
];

export const TEMPLATE_URLS = {
  GET_TEMPLATES:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettemplates",
  GET_TEMPLATE_BY_TEMPID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettemplatebyid/",
  GET_TEMPLATE_CATEGORY:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettemplatecategory",
};

export const SUBMISSION_URLS = {
  GET_SUBMISSIONS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getsubmissioncout/",
  DELETE_SUBMISSION:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletesubmissionrecord/",
  UPDATE_SUBMISSIONCOUNT_BY_FORMID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatesumissioncountbyformid",
};

export const INTEGRATIONS_URLS = {
  POST_INTEGRATION_FINISH_SETUP:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addintegrationfinishsetup",
};

export const GOOGLEAUTH_URLS = {
  GET_GOOGELDRIVE_FILES: "https://www.googleapis.com/drive/v3/files?key=",
  GET_GOOGLEAUTHTOKEN: "https://www.googleapis.com/oauth2/v3/token",
  GETWORKSHEETLIST_BY_SHEETID:
    "https://sheets.googleapis.com/v4/spreadsheets/{SHEETID}?key=",
  GETWORKSHEET_COLUMNLIST_BY_ID:
    "https://sheets.googleapis.com/v4/spreadsheets/{WORKSHEETID}/values/{WORKSHEETTITLE}!A1:z5",
  // "https://sheets.googleapis.com/v4/spreadsheets/{WORKSHEETID}/values/{WORKSHEETTITLE}!!A1:D5",
  // "https://sheets.googleapis.com/v4/spreadsheets/{WORKSHEETID}/values/A1:Z5?majorDimension=ROWS&key=",
  GETUSER_INFO:
    "https://www.googleapis.com/plus/v1/people/me?access_token={accces_token}",
  GET_ACCOUNT_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getauthintegrationacct",
  ADD_AUTH_INTEGRATION:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addauthintegrationacct",
  GET_GOOGLE_SHEET_BY_ACCID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getgooglesheetbyintaccntid/",
  ADD_WORKSHEET_SET_UP:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addworksheetsetup",
  ADD_GOOGLE_SHEET_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addgooglesheet",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  UPDATEWORKSHEET_COLUMNS:
    "https://sheets.googleapis.com/v4/spreadsheets/{SheetID}/values/{WorkSheetTitle}!A1%3AZ5:append?includeValuesInResponse=true&insertDataOption=INSERT_ROWS&valueInputOption=RAW&key={APIKEY}",
  GET_PROFILEINFO_BYTOKEN: "https://www.googleapis.com/oauth2/v1/userinfo",
  GET_GOOGLE_CALENDERS:
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
  GET_APPOINTMENT_CALENDERS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getfinishsetupdata",
  INSERT_APPOINTMENT_TO_CALENDER:
    "https://www.googleapis.com/calendar/v3/calendars/",
    GET_REFRESH_TOKEN_BY_SETUPID: "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getfinishsetupbyid/"
};

// export const GOOGLEAUTH_CRENDENTIALS = {
//   APIKEY: "AIzaSyBQRzub4jUjyidHL6CpN1sD3VG-SQo3z1M",
//   GRANT_TYPE: "authorization_code",
//   CLIENT_ID:
//     "40783375522-ni4tjtatm0u0rhbqbrkf6els0l65gno1.apps.googleusercontent.com",
//   CLIENT_SECRET: "R2fTEqMJsswrNnWFmSpfoUAN",
//   REDIRECT_URI: "http://localhost:3000",
//   Scope:"https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email",
//   CALENDER_SCOPE: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
// };

export const GOOGLEAUTH_CRENDENTIALS = {
  APIKEY: "AIzaSyBChPqzFrQCNKlRRNwLcg_hw_nTg9EY2EQ",
  GRANT_TYPE: "authorization_code",
  CLIENT_ID:
    "107911542036-9khs2aihd95hbjgu46dfnaome4lc4jvj.apps.googleusercontent.com",
  CLIENT_SECRET: "by8ZXme3c6g42vrDn158FHRd",
  REDIRECT_URI: "http://localhost:3000",
  Scope:
    "https://www.googleapis.com/auth/drive  https://www.googleapis.com/auth/drive.file",
  CALENDER_SCOPE:
    "https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
};

export const SlackAuth_URLS = {
  GETCHANNELSLISTBYAUTH_URL: "https://slack.com/api/conversations.list",
  GETUSERSLISTBYAUTH_URL: "https://slack.com/api/users.list",
  POST_OAUTH_ACCESS: "https://slack.com/api/oauth.access",
  POST_MESSAGE: "https://slack.com/api/chat.postMessage",
  ADD_REMINDER: "https://slack.com/api/reminders.add",
  GetSLACKAuthCODE_URL:
    "https://slack.com/oauth/authorize?scope=chat:write:user,chat:write:bot,team:read,reminders:write,channels:read,groups:read,im:write,users:read&client_id={CLIENTID}&redirect_uri={REDIRECTURI}",
  GETSLACK_ACCESS_TOKEN:
    "https://slack.com/api/oauth.access?client_id={CLIENTID}&client_secret={CLIENTSECRET}&code={CODE}",
  GETSLACK_CHANNEL_BY_INTACCTID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getslackchannelbyintacctid/",
  GETSLACK_USER_BY_INTACCTID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getslackuserbyintaccntid/",
  ADD_SLACK_CHANNEL_USER:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addslackchannel-user",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
export const SLACKAUTH_CREDENTIALS = {
  CLIENT_ID: "826821460741.834832135730",
  CLIENT_SECRET: "f477540419bbf28cd84915bfe69b7c5d",
  REDIRECT_URI: window.location.origin + "/user/IntegrationNwebhooks/",
};
export const TRELLOAUTH_CREDENTIALS = {
  API_KEY: "5bcf3e9ea10041ca755854f735660536",
  CLIENT_SECRET: "",
};
export const TRELLOAUTH_URLS = {
  GET_TRELLOMEMBERDETAIL:
    "https://api.trello.com/1/members/me/?key={yourAPIKey}&token={yourAPIToken}",
  GET_BOARDLISTBYMEMBERID:
    "https://api.trello.com/1/members/{id}/boards?filter=all&fields=all&lists=none&memberships=none&organization=false&organization_fields=name,displayName&key={yourAPIKey}&token={yourAPIToken}",
  GET_AUTHSTATUSTYPELISTBYBOARDID:
    "https://api.trello.com/1/boards/{id}/lists?cards=none&card_fields=all&filter=open&fields=all&key={yourAPIKey}&token={yourAPIToken}",
  ADD_TRELLOCARD: "https://api.trello.com/1/cards?",
  ADD_TRELLOLIST: "https://api.trello.com/1/lists?",
  ADD_TRELLOBOARD: "https://api.trello.com/1/boards/?",
  GET_TRELLOORGANIZATIONLIST:
    "https://api.trello.com/1/members/{id}/organizations?filter=all&fields=all&paid_account=false&key={yourAPIKey}&token={yourAPIToken}",

  //ADD_TRELLOBOARDSTATUSTYPE:"https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addtrelloboardstatustype"
};
export const TRELLO_URLS = {
  ADD_TRELLOORGANIZATION:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addtrelloorganization",
  GET_TRELLOORGANIZATIONLISTBYID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettrelloorgnbyintaccntid/",
  GET_BOARDLISTBYINTACCNTID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettrelloboardsbyintaccntid/",
  ADD_TRELLOBOARDSTATUSTYPE:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addtrelloboardstatustype",
  GET_TRELLOBOARDSTATUSTYPEByID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettrelloboardstatustypebyid/",
  ADD_TRELLO_BOARDS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addtrelloboards",
  REMOVE_TRELLO_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};

export const TRELLO_AWSURLS = {};

export const MAILCHIMPAUTH_CREDENTIALS = {
  CLIENT_ID: "516639009121",
  CLIENT_SECRET: "e4fd5796ece6b09e801ba4db5110eb1c8f8563c3204e5c61fb",
  API_KEY: "2cb6d64fd06f18faa57a8734d972813f-us5",
  //REDIRECT_URI: "https://master.d1i3h6ck09x8p5.amplifyapp.com/user/IntegrationNwebhooks",
  REDIRECT_URI: "http://127.0.0.1:3000/user/IntegrationNwebhooks",
};
export const MAILCHIMPAUTH_URLS = {
  AUTH_URL:
    "https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id=516639009121&redirect_uri=",
};

export const MAILCHIMPAPI_URLS = {
  ADD_MAILCHIMPLIST:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addmailchimplist",
  GET_MAILCHIMPLISTBYINTACCNTID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmailchimplistbyintacctid/",
  GET_ACCESS_TOKEN:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmailchimpaccesstoken",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};

export const CONVERTKIT_API_URLS = {
  GET_FORMS_LIST_URL: "https://api.convertkit.com/v3/forms?api_secret=",
  GET_SEQUENCES_LIST_URL: "https://api.convertkit.com/v3/sequences?api_secret=",
  GET_TEGS_LIST_URL: "https://api.convertkit.com/v3/tags?api_secret=",
  ADD_SUBSCRIBER_TO_FORM_URL: "https://api.convertkit.com/v3/forms/",
  ADD_SUBSCRIBER_TO_TAGS_URL: "https://api.convertkit.com/v3/tags/",
  ADD_SUBSCRIBER_TO_SQUENCE_URL: "https://api.convertkit.com/v3/sequences/",
};

export const WEBHOOKS_URLS = {
  GET_WEBHOOKS_LIST:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getwebhookslistbyformid/",
  DELETE_WEBHOOK:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletewebhook/",
  ADD_WEBHOOK:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addwebhooks",
};

export const PRICING_URLS = {
  GET_PRICING_LIST:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getpricinglistbyclientid/",
  GET_FAQ_LIST:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getfaqlistbyclientid/",
};

export const TRACKFORM_URLS = {
  ADD_TRACKING_FORM:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addtrackingform",
  GET_TRACKING_FORM:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettrackingform",
  UPDATE_TRACKING_FORM_VISIT_COUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatetrackingformvisitcount",
};

export const STRIPE_PAYMENTS = {
  COUPON_CODE: "10_PER_OFF",
  CLIENT_ID: "ca_HZZSYqE8JMk7s8pkrh8YKIw0xToRVvAG",
  PUBLISHABLE_KEY:
    "pk_test_51H0QI3CavDo2irJOnp3ReRemLVnfGvNS6IfpmxIAXzHq8dexd27DJlhBtZuwZShm9OFnysC8hJ7KhiupKPKsiEge00whiwaZv7",
  CLIENT_SECRET:
    "sk_test_51H0QI3CavDo2irJO1pwawN2ApD6HerCylFv0ufBoDkAm7ag128gyK7hdTpLXAmYDBjhrPXRkABAxHaZZmdwHQ1c100u1PTLrqm",
  GRANT_TYPE: "authorization_code",
  // HOSTNAME: "api.stripe.com",     // Live
  HOSTNAME: "dashboard.stripe.com", // SandBox
  // STRIPE_AUTH_URL: "https://connect.stripe.com/oauth",  // Live Mode
  STRIPE_AUTH_URL: "https://dashboard.stripe.com/oauth", // Sandbox Mode
  PAYMENT_REQUEST_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/stripepaymentrequest",
  ACCESSTOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getuserstripetoken",
  GET_ACCOUNT_DETAILS_BY_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getstripeaccountdetailfromtoken",
};

export const PAYMENT_ACCOUNT_URLS = {
  ADD_PAYMENT_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postpaymentaccount",
  GET_PAYMENT_ACCOUNT_BY_USER:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getpaymentaccountbyuser/",
  GET_PAYMENTDETAIL_BY_ID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getpaymentaccntdetail/",
  REMOVE_PAYMENT_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletepaymentaccount/",
  SAVE_PAYMENT_INFO_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addpaymentinfo",
};

export const SQUARE_PAYMENTS = {
  //=== Uncomment below four line for production mode
  // CLIENT_ID: "sq0idp-cmVEYmGlC6lpXMdb3SGDyg",
  // CLIENT_SECRET: "sq0csp-R-bbrhmvoRJA015cjzGkndaA_yOqMH8xA5qEW5DRoO8",
  // HOSTNAME: "squareup.com",
  // PAYMENT_MODE: "Live"

  CLIENT_ID: "sandbox-sq0idb-cvwAeUvWWwZzg5js2z9-6Q",
  CLIENT_SECRET: "sandbox-sq0csb-BLrkb75YsxiQEUimyZxpPerOEKk2wJtOQCLY68pBylM",
  HOSTNAME: "connect.squareupsandbox.com",
  PAYMENT_MODE: "Sandbox",

  GRANT_TYPE: "authorization_code",
  ACCESSTOKEN_URL: "https://connect.squareup.com/oauth2/token",
  TOKENAUTH_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getsquareaccesstoken",
  GET_MERCHANT_URL: "https://connect.squareup.com/v2/merchants/",
  PAYMENT_REQUEST_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/squarepaymentrequest",
  GET_ACCOUNT_DETAILS_BY_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getsquareaccountdetailbytoken",
};

export const PAYPAL_PAYMENTS = {
  SANDBOX_CLIENT_ID:
    "AaNjfL3Per1uj44hgE1wNZG7RBIe3TgVL7XDRVK775tRB5Jr-VrMRC2sT0_C2R1DNP2pXsrYLu4UevXa",
  SANDBOX_CLIENT_SECRET:
    "EB4bo2DIyb2G4jROL0AA1DcZ6eX_rT8zadouLc0KSTQgnOkdTu9wPgVRU_LIYj2Bn2_R4gdUiJ3ee9WI",
  CLIENT_ID:
    "AVw7tbIN-LZu5YPxqvjSIuXQDaFkgB8knt6Dky6nVed_8aQLXMIREjnhoC0HTJOCQM6GhIRWVH67RGXv",
  CLIENT_SECRET:
    "EIzNWLoBF4BZZcuBV34GTSJKsZ1viP6yVrMwggQbLJgXdfJ7ChY3N217A9jWdV03rgYPkSWaVvLM3zZ8",
  // MODE: "production",
  MODE: "sandbox",
  GET_ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getpaypalacesstoken",
  BUTTON_SCRIPT_URL: "https://www.paypalobjects.com/api/checkout.js",
};

export const BRAINTREE_PAYMENTS = {
  ENVIRONMENT: "sandbox", // sandbox/production
  GET_MERCHANT_DETAIL_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getBraintreeInfo",
  GET_ACCESS_TOKEN:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getbrainaccesstoken",
  PAYMENT_REQUEST_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/braintreepaymentrequest",
};

export const THEME_URLS = {
  GET_FORM_LIST_URLS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getformsloginuser/",
  POST_TRANSLATION_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/posttranslationinfo/",
  ADD_THEME_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addthemeinfo",
  GET_THEME_INFO_BY_FORMID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getthemeinfobyformid/",
  GET_TRANSLATION_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettranslationlistbyformId/",
  GET_TRANSLATION_EDIT_LIST:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gettranslationbytranslationid/",
  UPDATE_SELECTED_SERVICE:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/UpdateSelectedTranslation",
  UPDATE_ALL_FALSE_SERVICES:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/UpdateTranslationFalsebyFormId",
  DELETE_TRANSLATION:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletetranslation/",
  ACCOUNT_DETAILS_MAKE_DEFAULT_TRANSLATION:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatetranslationmarkasdefaultaccountdetails",
};

export const ACCOUNT_SETTINGS = {
  GETACCOUNT_SETTINGS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getloginuserinfo/",
  UPDATE_ACCOUNTDETAILS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateuserinfo",
  POST_BILLINGINFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addbillinginfo",
  GET_BILLINGINFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getbillingInfo",
  POST_RECEIPTINFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addreceiptinfo",
  GET_RECEIPT_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getreceiptinfo/",
};

export const BIILING_URLS = {
  GET_PLANS_LIST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getsubscriptionplanslist",
  CREATE_CUSTOMER_SUBSCRIPTION_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addcustomerandsubscription",
  SAVE_BILLING_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addbillinginfo",
};

export const USER_RELATED_URLS = {
  USER_LOGIN:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/userlogin",
  ADD_USER_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/adduserinfo",
  CHECK_USER_EXIST:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/checkuserexist",
  GET_REFERRED_USERS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getuserreferralcount/",
  PASSWORD_UPDATE:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateuserpassword",
  TWO_FACTOR_AUTHENTICATION:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updatestep2factoruser",
  VERIFY_USER_EMAIL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateusertoverified",
};

export const ACTIVE_CAMPAIGNS_URLS = {
  ALL_ACTIVE_CAMPAIGN_INFO:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getactivecampaingallautomations",
  POST_ACTIVE_CAMPAIGNS_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postactivecampaignsAPI",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};

// Start MailerLite
export const MAILER_LITE_URLS = {
  API_URL: "https://api.mailerlite.com",
  GET_MAILER_LITE_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmailerlitelambda",
  POST_MAILER_LITE_INFO:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postmailerlitelambda",

  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
//End MailerLite

// Start MailShake
export const MAILSHAKEAUTH_URLS = {
  AUTH_URL:"https://mailshake.com/connect/?Ftype=web_server&client_id=709cb67f-b15c-4696-900d-b847b861dd13&state=nostate&scope=campaign-read,campaign-write&redirect_uri=https://master.d1i3h6ck09x8p5.amplifyapp.com/",
    // "https://mailshake.com/connect/?Ftype=web_server&client_id=709cb67f-b15c-4696-900d-b847b861dd13&scope=campaign-read,campaign-write&state=nostate",
    REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmailshakeapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postmailshakeapirequest",
  BASE_URL: "https://api.mailshake.com/2017-04-01/",
  };
//End MailShake

// Start ZohoCRM
export const ZOHOCRMAUTH_URLS = {
  CLIENT_ID: "1000.PN4B8BLLW01841CJA5DU5M48ZXWAJY",
  CLIENT_SECRET: "94abed98ded8771dfb32ca1c0cbb7bb63f93e533b2",
  AUTH_URL:
    "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.users.READ,ZohoCRM.settings.ALL&client_id=1000.PN4B8BLLW01841CJA5DU5M48ZXWAJY&response_type=code&access_type=offline&redirect_uri=",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getzohocrmaccesstoken",
  ZOHO_USERS_API: "https://www.zohoapis.com/crm/v2/users?type=AllUsers",
  ZOHO_MODULES_API: "https://www.zohoapis.com/crm/v2/settings/modules",
  ZOHO_LAYOUTS_API: "https://www.zohoapis.com/crm/v2/settings/layouts?module=",
  ZOHO_FIELDS_API: "https://www.zohoapis.com/crm/v2/settings/fields?module=",
  GET_ACCOUNT_DETAILS_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getzohoCRMapi",
};
//End ZohoCRM

// Start Asana
export const ASANAUTH_URLS = {
  CLIENT_ID: "1186200594130204",
  CLIENT_SECRET: "e6ec758f56e4dc6b0ea178ed989d0bad",
  AUTH_URL:
    "https://app.asana.com/-/oauth_authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getasanaaccesstoken",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getasanaapirequest",
  BASE_URL: "https://app.asana.com/",
  POST_URL:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postasanaapirequest",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
//End Asana
//Start InterCom
export const INTERCOM_URLS = {
  CLIENT_ID: "8304ca5e-ac79-42c9-8ced-d8f3fd0e12e3",
  CLIENT_SECRET: "caf1bb0b-8d6c-4c4b-9082-7ddded51678b",
  BASE_URL: "https://api.intercom.io/",
  AUTH_URL:
    "https://app.intercom.com/oauth?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getintercomaccesstoken",
  GET_INTERCOM_ACCOUNT_DETAIL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getintercomapirequest",
  POST_INTERCOM_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postintercomapirequest",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
//EndInterCom
// Start Campaign Monitor
export const CAMPAIGN_MONITOR_AUTH_URLS = {
  CLIENT_ID: "121117",
  CLIENT_SECRET:
    "5Sn50l7Ku1j5862OVTm115geHFY4kGfzA43R8q35l1161xMA6WG8F6mqsV34XM4Nf55d8MiL7TmNnq3K",
  AUTH_URL:
    "https://api.createsend.com/oauth?type=web_server&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=ManageLists%2CImportSubscribers",
  REDIRECT_URL: "http://127.0.0.1:3000/user/IntegrationNwebhooks",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getcampaignmonitoraccesstoken",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getcampaignmonitorapirequest",
  BASE_URL: "https://api.createsend.com/",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postcampaignmonoitorapirequest",
};
//End Campaign Monitor

// Start DropBox
export const DROPBOX_AUTH_URLS = {
  CLIENT_ID: "tpljib9kxtnoudx",
  CLIENT_SECRET: "ghweflc9m0fytx9",
  AUTH_URL:
    "https://www.dropbox.com/oauth2/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getdropboxaccesstoken",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postdropboxlambdarequest",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
// End DropBox

// Start HelpScout
export const HELPSCOUT_AUTH_URLS = {
  CLIENT_ID: "45W1K9MyLSHKehfktMEf9YGedQ9nZowK",
  CLIENT_SECRET: "sdeHAZrIr2Ad5BH6w07GQhuFOqkYzmSu",
  AUTH_URL:
    "https://secure.helpscout.net/authentication/authorizeClientApplication?client_id={CLIENT_ID}",
  REDIRECT_URL: "http://127.0.0.1:3000/user/IntegrationNwebhooks",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gethelpscoutaccesstoken",
  UPDATE_REFRESH_TOKEN_URL:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/updateauthrefreshtoken",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gethelpscoutapirequest",
  BASE_URL: "https://api.helpscout.net/",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/posthelpscoutapirequest",
};
//End HelpScout

// Start HubSpot
export const HUBSPOT_AUTH_URLS = {
  CLIENT_ID: "ba79bc40-7d1c-4bea-a313-e4546984e942",
  CLIENT_SECRET: "17844fed-dc69-433f-87cb-90691c043231",
  APP_ID: "226111",
  AUTH_URL:
    "https://app.hubspot.com/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=contacts",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gethubspotaccesstoken",
  BASE_URL: "https://api.hubapi.com/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/gethubspotapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/posthubspotapirequest",
};
// End HubSpot

// Start Keap
export const KEAP_AUTH_URLS = {
  CLIENT_ID: "wSx6horvLM0tsQfA5QKp2zOvsXB7TCYc",
  CLIENT_SECRET: "CX3yjHyQSA5dlEBd",
  APP_ID:"29c7e2b2-de60-4931-a3c6-f0b963487d8d",
  AUTH_URL:
    "https://accounts.infusionsoft.com/app/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=full&response_type=code",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  ACCESS_TOKEN_URL:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getkeapinfusionaccesstoken",
  BASE_URL: "https://api.infusionsoft.com/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getkeapinfusionapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/posthubspotapirequest",
};
// End Keap

// Start Meistertask
export const MEISTER_TASK_AUTH_URLS = {
  CLIENT_ID: "a3053b6c4ca96819d625b9249826e46a41f3e3ed5a824b237b24728cffa52f92",
  CLIENT_SECRET:
    "a6920fee488f5d5112c30b9049f3496cb681233f78ac66fb49c9d32a366ebb73",
  AUTH_URL:
    "https://www.mindmeister.com/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=meistertask%20userinfo.profile%20userinfo.email&response_type=code",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmeistertaskaccesstoken",
  BASE_URL: "https://www.mindmeister.com/",
  GET_BASE_URL: "https://www.meistertask.com/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getmeistertaskapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postmeistertaskapirequest",
};
// End Meistertask

// Start Freshdesk
export const FRESH_DESK_AUTH_URLS = {
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getfreshdeskapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postfreshdeskapirequest",
};
// End Freshdesk

// Start Moosend
export const MOOSEND_AUTH_URLS = {
  POST_API:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postmoosendapirequest",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
// End Moosend

// Start GoToWebinarS
export const GOTOWEBINAR_AUTH_URLS = {
  CLIENT_ID: "0c0c2576-fc92-4a88-9cce-ae55cd510f73",
  CLIENT_SECRET: "/OvDTdLJ/urECIZSZGU3NA==",
  AUTH_URL:
    "https://authentication.logmeininc.com/oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getgotowebinaraccesstoken",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getgotowebinarapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postgotowebinarapirequest",
  RECORDING_ASSETS:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getrecordingassetgotowebinar",
  START_DATE:
    new Date(Date.now()).toISOString().substring(0, 10) + "T10:00:00Z",
  END_DATE:
    new Date(new Date().setMonth(new Date().getMonth() + 12))
      .toISOString()
      .substring(0, 10) + "T22:00:00Z",
};
// End GoToWebinar

// Start ClickSend
export const CLICKSEND_AUTH_URLS = {
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
  GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getclicksendapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postclicksendapirequest",
  BASE_URL: "https://rest.clicksend.com/v3/",
};
// End ClickSend

// Start Zendesk
export const ZENDESK_AUTH_URLS = {
  CLIENT_ID:"formb_24092020",
  CLIENT_SECRET:"57edf92376fbbf258327244237f977b9e83caa50b483faffbdf78d560305cb85",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
    GET_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getzendeskapirequest",
  POST_API:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postzendeskapirequest",
  BASE_URL: "https://{subdomain}.zendesk.com/",
  AUTH_URL:"oauth/authorizations/new?response_type=code&redirect_uri={REDIRECT_URI}&client_id={CLIENT_ID}&scope=read%20write",
  ACCESS_TOKEN_URL:
  "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getzendeskaccesstoken",

};
// End ClickSend

export const CUSTOM_PDF = {
  GET_CUSTOM_PDF_FORMID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getcustompdfbyformid/",
  ADD_CUSTOM_PDF:
    " https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/addcustompdf/",
  GET_CUSTOM_PDF_ID:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getcustompdfbyid/",
  DELETE_CUSTOM_PDF:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/deletecustompdf/",

  GET_FILE_PATH: window.location.origin.toString() + "/CustomPDF/",
};
export const INVITE_REFERRAL = {
  GET_USER_NAME:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/getusernameuserId/",
};
export const ENCRYPTION_KEYS = {
  SECRETKEY: "69845lkhj21335",
};

export const WEB_FONTS_KEYS = {
  SECRETKEY: "AIzaSyBLd7fQNpwB5TlyPoPkc2NU9DPWdjvvZps", // This is the google API key
  LIMIT: 1000,
};

export const AWS_BUCKET = {
  NAME:"defactoform-objects",
  HTTP:'http',
  COVERIMAGE:"CoverImages",
  THEMEIMAGE:"ThemeImages",
  IMAGEURL:"https://defactoform-objects.s3.amazonaws.com/FormImages/",
  COVERIMAGEURL:"https://defactoform-objects.s3.amazonaws.com/CoverImages/",
  THEMEIMAGEURL:"https://defactoform-objects.s3.amazonaws.com/ThemeImages/"
};
