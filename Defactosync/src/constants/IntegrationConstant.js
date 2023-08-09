// Integration API
export const AUTH_INTEGRATION = {
  ADD_API: "/syncadd-integrations",
  GET_API: "/sync-get-integration-request",
  URL_ENCODED_ACCESS_TOKEN: "sync-get-urlencoded-accesstoken-request",
  POST_API: "/sync-post-integration-request",
  DELETE_API: "/sync-delete-integration-request",
  PUT_API: "/sync-put-integration-request",
  REMOVE_ACCOUNT:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/removeaccount/",
};
// Integration API
// Asana
export const ASANAUTH_URLS = {
  CLIENT_ID: "1198751154508697",
  CLIENT_SECRET: "c5d220dbfcafac16e879d101510d5427",
  AUTH_URL:
    "https://app.asana.com/-/oauth_authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  ACCESS_TOKEN_URL: "/sync-get-asana-token",
};
// Asana

// Start Active Campaign
export const ACTIVECAMPAIGN_AUTH_URLS = {
  GET_LIST: "/api/3/lists",
  CREATE_WEBHOOK: "/api/3/webhooks",
  DELETE_WEBHOOK: "/api/3/webhooks/{webhookId}",
  GET_USER_ME: "/api/3/users/me",
  GET_ACCOUNTS_LIST: "/api/3/accounts",
  GET_DEALS_LIST: "/api/3/deals",
  GET_EVENTS_LIST: "/api/3/eventTrackingEvents",
  GET_PIPELINE_LIST: "/api/3/dealGroups",
  GET_STAGES_LIST: "/api/3/dealStages",
  GET_OWNERS_LIST: "/api/3/users",
  GET_CONTACTS_LIST: "/api/3/contacts",
};
// End Active Campaign

// Start Campaign Monitor
export const CAMPAIGN_MONITOR_AUTH_URLS = {
  CLIENT_ID: "121117",
  CLIENT_SECRET:
    "5Sn50l7Ku1j5862OVTm115geHFY4kGfzA43R8q35l1161xMA6WG8F6mqsV34XM4Nf55d8MiL7TmNnq3K",
  AUTH_URL:
    "https://api.createsend.com/oauth?type=web_server&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=ManageLists%2CImportSubscribers%2CAdministerAccount",
  ACCESS_TOKEN_URL: "/sync-get-campaignmonitor-token",
  GET_CLIENTS: "https://api.createsend.com/api/v3.2/clients.json",
  GET_CLIENT_LIST:
    "https://api.createsend.com/api/v3.2/clients/{clientid}/lists.json",
  CREATE_WEBHOOK:
    "https://api.createsend.com/api/v3.2/lists/{listId}/webhooks.json",
  DELETE_WEBHOOK:
    "https://api.createsend.com/api/v3.2/lists/{listid}/webhooks/{webhookid}.json",
  BASE_URL: "https://api.createsend.com/api/v3.2/",
};
//End Campaign Monitor

// Start Meistertask
export const MEISTER_TASK_AUTH_URLS = {
  CLIENT_ID: "1f70870aa0e966e06363c4739d1f9137b0eacffb86ca1baace8f21e7a8abd85f",
  CLIENT_SECRET:
    "e1e5e6de95c9bc9eb951e5a6804bb641882fbe833765927383b370896865c2f8",
  AUTH_URL:
    "https://www.mindmeister.com/oauth2/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=meistertask%20userinfo.profile%20userinfo.email&response_type=code",
  BASE_URL: "https://www.mindmeister.com/",
};
// End Meistertask

// Start ClickUp
export const CLICKUP_AUTH_URLS = {
  CLIENT_ID: "MBWRHESLXFSLEHUNOY087HK1XGGW3Q2P",
  CLIENT_SECRET:
    "HNZ7WBZIJ17S9LX9OFB3RZ2Q8UV4HVJLLFIZHY18I6ZX88QI6N61LR4P1LFWQ2AY",
  AUTH_URL: "https://app.clickup.com/api?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  ACCESS_TOKEN_URL: "oauth/token?client_id={CLIENT_ID}&client_secret={CLIENT_SECRET}&code={CODE}",
  BASE_URL: "https://api.clickup.com/api/v2/",
  DELETE_WEBHOOK: "webhook/{id}",
  GET_TEAMS: "team",
  GET_SPACES: "team/{id}/space",
  GET_TASKS: "team/{id}/task",
  GET_LISTS: "space/{id}/list?archived=false"
};
// End ClickUp

// Slack
export const SLACK_AUTH_URLS = {
  APP_ID: "A01H39M9FHS",
  CLIENT_ID: "943186942839.1581327321604",
  CLIENT_SECRET: "6c4a1e7de258c589cfbd523258011329",
  SIGNING_SECRET: "ef36869c2b7aec2c08c86c4478b86383",
  AUTH_URL:
    "https://slack.com/oauth/authorize?scope=chat:write:user,search:read,users.profile:write,users:read.email,chat:write:bot,files:read,users:read,team:read,reminders:write,channels:read,groups:read,im:write,users:read,im:read,users.profile:read,mpim:history,reactions:read,groups:history,reminders:write,channels:write,channels:history,im:history,emoji:read,reactions:write&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  ACCESS_TOKEN_URL: "/sync-get-slack-token",
  BASE_URL: "https://slack.com/api",
  GET_CHANNELS_LIST_URL:
    "https://slack.com/api/conversations.list?types=public_channel%2Cprivate_channel",
  GET_REACTIONS_LIST_URL: "https://slack.com/api/emoji.list",
  GET_USERS_LIST_URL: "https://slack.com/api/users.list",
  POST_OAUTH_ACCESS: "https://slack.com/api/oauth.access",
  POST_MESSAGE: "https://slack.com/api/chat.postMessage",
  ADD_REMINDER: "https://slack.com/api/reminders.add",
};
// End Slack

// Trello
export const TRELLOAUTH_URLS = {
  API_KEY: "5bcf3e9ea10041ca755854f735660536",
  APP_NAME: "FormSync",
  BASE_URL: "https://api.trello.com/1/",
  AUTH_URL:
    "https://trello.com/1/authorize?expiration=never&name={APP_NAME}&scope=read,write&response_type=token&key={API_KEY}&return_url={REDIRECT_URI}",
  GET_MEMBER_DETAIL:
    "https://api.trello.com/1/members/me/?key={yourAPIKey}&token={yourAPIToken}",
  CREATE_WEBHOOK:
    "https://api.trello.com/1/webhooks?key={yourAPIKey}&token={yourAPIToken}",
  DELETE_WEBHOOK:
    "https://api.trello.com/1/webhooks/{webhookId}?key={yourAPIKey}&token={yourAPIToken}",
  GET_BOARDS:
    "https://api.trello.com/1/members/{memberId}/boards?key={yourAPIKey}&token={yourAPIToken}",
  GET_BOARD_LISTS:
    "https://api.trello.com/1/boards/{id}/lists?key={yourAPIKey}&token={yourAPIToken}",
  GET_CARDS_BY_LISTID:
    "https://api.trello.com/1/lists/{id}/cards?key={yourAPIKey}&token={yourAPIToken}",
  GET_BOARD_CARDS:
    "https://api.trello.com/1/boards/{id}/cards?key={yourAPIKey}&token={yourAPIToken}",
  GET_BOARD_LABELS:
    "https://api.trello.com/1/boards/{id}/labels?key={yourAPIKey}&token={yourAPIToken}",
  GET_ORGANIZATIONS_BY_MEMBERID:
    "https://api.trello.com/1/members/{id}/organizations?key={yourAPIKey}&token={yourAPIToken}",
  GET_CHECKLIST_BY_CARD:
    "https://api.trello.com/1/cards/{id}/checklists?key={yourAPIKey}&token={yourAPIToken}",
  GET_CHECKLIST_ITEMS_BY_CHECKLIST:
    "https://api.trello.com/1/checklists/{id}/checkItems?key={yourAPIKey}&token={yourAPIToken}",
  GET_MEMBERS_BY_BOARD_ID:
    "https://api.trello.com/1/boards/{id}/members?key={yourAPIKey}&token={yourAPIToken}",
  GET_CHECKLIST_BY_BOARD:
    "https://api.trello.com/1/boards/{id}/checklists?key={yourAPIKey}&token={yourAPIToken}",
};
// End Trello

// MailChimp
export const MAILCHIMP_AUTH_URLS = {
  CLIENT_ID: "610030116208",
  CLIENT_SECRET: "14f4708e0a2e1b5ff0f9cd6101e2ea437275f9427dbd7eec7a",
  AUTH_URL:
    "https://login.mailchimp.com/oauth2/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  CREATE_WEBHOOK: "/3.0/lists/{listId}/webhooks",
  DELETE_WEBHOOK: "/3.0/lists/{list_id}/webhooks/{webhook_id}",
  GET_AUDENCIES: "/3.0/lists",
  GET_CAMPAIGNS: "/3.0/campaigns",
  GET_TEMPLATES: "/3.0/templates",
  GET_SEGMENTS: "/3.0/lists/{listId}/segments",
};
// End Mailchimp

// Google Credentials

export const GOOGLE_CREDENTIALS = {
  CLIENT_ID:
    "507519910076-n4lcbng9fqjd7mautuiekkecjmf2r7h3.apps.googleusercontent.com",
  CLIENT_SECRET: "J4uvkaF0aZAgeLiCPcr8XDlu",
};

// export const GOOGLE_CREDENTIALS = {
//   CLIENT_ID:
//     "765071199998-6ib8i56c9m7ac7pdls7s03irn1e6vkfo.apps.googleusercontent.com",
//   CLIENT_SECRET: "uUF3aPuCjgZvQiwplNYjai8V",
// };


// End Google Crdentials

// Gmail
export const GMAIL_AUTH_URLS = {
  AUTH_URL:
    // "https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https://mail.google.com/%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
    "https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.compose%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.modify%20https://www.googleapis.com/auth/userinfo.profile%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
  ADD_WATCH: "https://gmail.googleapis.com/gmail/v1/users/me/watch",
  WATCH_TOPIC: "projects/formsync/topics/Gmail",
  STOP_WATCH: "https://gmail.googleapis.com/gmail/v1/users/me/stop",
  GET_LABELS: "https://gmail.googleapis.com/gmail/v1/users/me/labels",
  GET_MESSAGES: "https://gmail.googleapis.com/gmail/v1/users/me/messages",
  GET_THREADS: "https://gmail.googleapis.com/gmail/v1/users/me/threads",
};
// End Gmail

// GoogleSheet
export const GOOGLE_SHEET_AUTH_URLS = {
  BASE_URL: "https://sheets.googleapis.com/v4/",
  // AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts profile email&flowName=GeneralOAuthFlow&state=ERTYTUJHFGDsdfgEWRTG345678JHGDSFGsdftyukjhghfd23456ygd",
  AUTH_URL:
    "https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fspreadsheets%20https://www.googleapis.com/auth/userinfo.profile%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
  GET_SPREADSHEETS:
    "https://spreadsheets.google.com/feeds/spreadsheets/private/full",
  GET_WORKSHEETS: "spreadsheets/{spreadsheetId}",
};
// End GoogleSheet

// GoogleDrive
export const GOOGLE_DRIVE_AUTH_URLS = {
  AUTH_URL://"https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive%20https://www.googleapis.com/auth/drive.readonly%20https://www.googleapis.com/auth/userinfo.profile%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
    "https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive%20https://www.googleapis.com/auth/userinfo.profile%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
  GET_FOLDERS:
    "https://www.googleapis.com/drive/v2/files?q=mimeType:'application/vnd.google-apps.folder'&maxResults=999",
  GET_PAGE_TOKEN: "https://www.googleapis.com/drive/v3/changes/startPageToken",
  ADD_WATCH: "https://www.googleapis.com/drive/v2/changes/watch",
  STOP_WATCH: "https://www.googleapis.com/drive/v3/channels/stop",
  CREATE_WEBHOOK:
    "https://api.miosync.com/dev/sync-googledrive-web-hook-request?commonInfo={commonInfo}",
  GET_FILES:
    "https://www.googleapis.com/drive/v2/files?q=mimeType!='application/vnd.google-apps.folder'&orderBy=modifiedDate desc&maxResults=999",
};
// End GoogleDrive

export const GOOGLE_CALENDAR_AUTH_URLS = {
  AUTH_URL: //"https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar%20https://www.googleapis.com/auth/userinfo.profile%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
    "https://accounts.google.com/o/oauth2/v2/auth?client_id={CLIENT_ID}&response_type=code&scope=https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/userinfo.profile%20email&redirect_uri={REDIRECT_URI}&access_type=offline&prompt=consent",
  Get_Calender_List:
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
  CREATE_WEBHOOK:
    "https://api.miosync.com/dev/sync-googlecalendar-web-hook-request?commonInfo={commonInfo}",
  ADD_WATCH:
    "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/watch",
  STOP_WATCH: "https://www.googleapis.com/calendar/v3/channels/stop",
  GET_EVENTS:
    "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events?maxResults=1000",
  GET_EVENT:
    "https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/{eventId}",
};
// End GoogleCalendar

// HelpScout
export const HELP_SCOUT_AUTH_URLS = {
  CLIENT_ID: "r0VtcQfGguZwESujdTQ51Pyf6FSMwwUn",
  CLIENT_SECRET: "W6Sb348ajFaag6XAXMRwnhlv59pU8iXT",
  // CLIENT_ID: "9st7aNhM6UiXNGZNZRoBUJ7qdcMbyXHx",
  // CLIENT_SECRET: "LtvmqQm66ENrEjNNXYcEKZ0c8ZVuhAGh",
  AUTH_URL:
    "https://secure.helpscout.net/authentication/authorizeClientApplication?client_id={CLIENT_ID}",
  CREATE_WEBHOOK: "https://api.helpscout.net/v2/webhooks",
  DELETE_WEBHOOK: "https://api.helpscout.net/v2/webhooks/{webHookId}",
  GET_MAILBOX_LIST: "https://api.helpscout.net/v2/mailboxes",
  GET_USERS_BY_MAILBOX: "https://api.helpscout.net/v2/users?mailbox={mailbox}",
  GET_USERS: "https://api.helpscout.net/v2/users",
  GET_CONVERSATIONS: "https://api.helpscout.net/v2/conversations",
  GET_CUSTOMERS: "https://api.helpscout.net/v2/customers",
};
// End HelpScout

// HubSpot
export const HUB_SPOT_AUTH_URLS = {
  APP_ID: "237112",
  CLIENT_ID: "7456e0ca-e44a-45ba-9805-eb819e12d5b8",
  CLIENT_SECRET: "d5c8e57e-c275-4628-a795-8f85ce64fa35",
  AUTH_URL:
    "https://app.hubspot.com/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=business-intelligence",
};
// End HubSpot

// AirTable
export const AIRTABLE_AUTH_URLS = {
  TABLE_ID: "",
};
//End AirTable

// DropBox
export const DROPBOX_AUTH_URLS = {
  BASE_URL: "https://api.dropboxapi.com/2/",
  CLIENT_ID: "lamdcqmux5s5kxx",
  CLIENT_SECRET: "5brncth10um9aa2",
  AUTH_URL:
    "https://www.dropbox.com/oauth2/authorize?client_id={CLIENT_ID}&token_access_type=offline&response_type=code&redirect_uri={REDIRECT_URI}&scope=account_info.read files.content.read files.content.write files.metadata.read sharing.read file_requests.write sharing.write",
  ACCESS_TOKEN_URL:
    "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/postdropboxlambdarequest",
  GET_FOLDER_AND_FILE_LIST: "https://api.dropboxapi.com/2/files/list_folder",
};
// End DropBox

// Malerlite
export const Mailerlite_AUTH_URLS = {
  BASE_URL: "https://api.mailerlite.com/api/v2/",
  CREATE_WEBHOOK: "https://api.mailerlite.com/api/v2/webhooks",
  DELETE_WEBHOOK: "https://api.mailerlite.com/api/v2/webhooks/{webhookId}",
  GET_GROUPS: "https://api.mailerlite.com/api/v2/groups",
  GET_WEBFORMS: "https://api.mailerlite.com/api/v2/webforms",
};
// End Malerlite
// GOTOWEBINAR
export const GOTOWEBINAR_AUTH_URLS = {
  CLIENT_ID: "91223f60-ce12-4bdf-a7d3-2a879d50a70e",
  CLIENT_SECRET: "y5uzd3WaCLvUlGJct5zWvYXO",
  AUTH_URL:
    "https://authentication.logmeininc.com/oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  //"https://api.getgo.com/oauth/v2/authorize?client_id={CLIENT_ID}&response_type=code&redirect_uri={REDIRECT_URI}",
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
  END_DATE: new Date(Date.now()).toISOString().substring(0, 10) + "T22:00:00Z",
  START_DATE:
    new Date(new Date().setMonth(new Date().getMonth() - 12))
      .toISOString()
      .substring(0, 10) + "T22:00:00Z",
  CREATE_SECRET_KEY: "https://api.getgo.com/G2W/rest/v2/webhooks/secretkey",
  WEBHOOK: "https://api.getgo.com/G2W/rest/v2/webhooks",
  CREATE_SUBSCRIPTION: "https://api.getgo.com/G2W/rest/v2/userSubscriptions",
  GET_WEBINARS:
    "https://api.getgo.com/G2W/rest/v2/accounts/{accountKey}/webinars?fromTime={fromTime}&toTime={toTime}&size=150",
  GET_REGISTRANTS:
    "https://api.getgo.com/G2W/rest/v2/organizers/{organizerKey}/webinars/{webinarKey}/registrants",
  GET_RECORDINGS:
    "https://api.getgo.com/G2W/rest/v2/recordingassets/search?size=150",
};

// End GOTOWEBINAR

// Start Zendesk
export const ZENDESK_AUTH_URLS = {
  GET_USER_ME: "/api/v2/users/me",
  BASE_URL: "https://{subdomain}.zendesk.com/",
  dsfsf: "t9xwE06CRgt9ZsTA1JxsrntSaq48w5Awpc6Mmqc4",
  CREATE_TARGET: "api/v2/targets",
  DELETE_TARGET: "api/v2/targets/{target_id}",
  CREATE_TRIGGER: "api/v2/triggers",
  DELETE_TRIGGER: "api/v2/triggers/{trigger_id}",
  GET_TICKETS: "api/v2/tickets",
  GET_GROUPS: "api/v2/groups",
  GET_BRANDS: "api/v2/brands",
  GET_SHARING_AGREEMENT: "api/v2/sharing_agreements",
  GET_TICKET_FORM: "api/v2/ticket_forms",
  GET_ORGANIZATIONS: "/api/v2/organizations",
  GET_USERS: "/api/v2/users",
  GET_USERS_BY_SEARCH: "api/v2/search.json?query=type:user {query}",
  TRIGGER: ["Create", "Change"],
  CREATE_WEBHOOK:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-zendesk-web-hook-request?commonInfo={commonInfo}",
};
// End Zendesk

// Start Freshdesk
export const FRESHDESK_AUTH_URLS = {
  BASE_URL: "https://{subdomain}.freshdesk.com/",
  CREATE_WEBHOOK:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-freshdesk-web-hook-request?commonInfo={commonInfo}",
  CREATE_TICKET: "api/v2/automations/1/rules",
  UPDATE_TICKET: "api/v2/automations/4/rules",
  DELETE_WEBHOOK: "api/v2/automations/{automationType}/rules/{id}",
  GET_FORUM_CATEGORIES: "api/v2/discussions/categories",
  GET_FORUM_BY_ID: "api/v2/discussions/categories/{id}/forums",
};
// End Freshdesk

// Start MailShake
export const MAILSHAKE_AUTH_URLS = {
  BASE_URL: "https://api.mailshake.com/2017-04-01/",
  CREATE_WEBHOOK: "push/create",
  DELETE_WEBHOOK: "push/delete",
  GET_CAMPAIGNS: "campaigns/list",
  GET_TEAM_MEMBERS: "team/list-members",
};
// End MailShake

// Start `Keap`Infusionsoft
export const KEAP_AUTH_URLS = {
  CLIENT_ID: "BkBGX1UIXxmKGH6jXiRyPhHxRjlWYVkv",
  CLIENT_SECRET: "3mBHDlWlFJcMBALc",
  APP_NAME: "FormSync",
  APP_ID: "f4f148d6-941a-479e-8c25-903980f57bbd",
  BASE_URL: "https://api.infusionsoft.com/",
  AUTH_URL:
    "https://accounts.infusionsoft.com/app/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=full&response_type=code",
  CREATE_WEBHOOK: "crm/rest/v1/hooks",
  DELETE_WEBHOOK: "crm/rest/v1/hooks/{id}",
  VERIFY_WEBHOOK: "crm/rest/v1/hooks/{webhookId}/verify",
  GET_TAGS: "crm/rest/v1/tags?limit=1000",
  GET_CONTACTS: "crm/rest/v1/contacts?limit=1000",
  GET_USERS: "crm/rest/v1/users?limit=1000",
  GET_PRODUCTS: "crm/rest/v1/products?limit=1000",
  GET_ORDERS: "crm/rest/v1/orders?limit=1000",
  GET_COMPANIES: "crm/rest/v1/companies?limit=1000",
};
// End KeapInfusionsoft

// Start Intercom
export const INTERCOM_AUTH_URLS = {
  CLIENT_ID: "32094248-f5ef-492f-a784-8b7826b532a4",
  CLIENT_SECRET: "d1769532-0e27-4bb6-988e-173d77ebd7e5",
  APP_NAME: "FormSync",
  BASE_URL: "https://api.intercom.io/",
  AUTH_URL:
    "https://app.intercom.com/oauth?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  GET_TAGS: "tags",
  GET_COMPANIES: "companies",
  GET_CONTACTS: "contacts?per_page=150",
};
// End Intercom

// Start ZohoCRM
export const ZOHOCRM_AUTH_URLS = {
  CLIENT_ID: "1000.S2EQGL5NAIDJT9E3UWW6MR5YSV4G2U",
  CLIENT_SECRET: "8a555db59aaee8796f674ac5d92838544ec8333b23",
  APP_NAME: "FormSync",
  AUTH_URL:
    "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.users.ALL,ZohoCRM.settings.ALL,ZohoCRM.notifications.ALL,ZohoCRM.settings.tags.ALL,ZohoCRM.settings.tags.CREATE,ZohoCRM.org.ALL,ZohoCRM.files.CREATE,ZohoCRM.org.READ,ZohoSearch.securesearch.READ&client_id={CLIENT_ID}&response_type=code&access_type=offline&redirect_uri={REDIRECT_URI}",
  // AUTH_URL:
  //   "https://accounts.zoho.com/oauth/v2/auth?scope=ZohoCRM.modules.ALL,ZohoCRM.users.ALL,ZohoCRM.settings.ALL,ZohoCRM ZohoCRM.notifications.ALL,ZohoCRM.org.ALL,ZohoCRM.files.CREATE,ZohoCRM.org.READ,ZohoSearch.securesearch.READ&client_id={CLIENT_ID}&response_type=code&access_type=offline&redirect_uri={REDIRECT_URI}",
  BASE_URL: "https://www.zohoapis.com/crm/v2/",
  GET_MODULES: "settings/modules",
  GET_IDS: "{moduleType}",
  ADD_WATCH: "actions/watch",
  GET_FIELDS: "settings/fields?module={moduleType}",
  GET_LAYOUTS: "settings/layouts?module={module_api_name}",
  DELETE_WATCH:
    "actions/watch?scope=ZohoCRM.notifications.ALL&channel_ids={channel_id}",
  RELATED_LIST: "settings/related_lists?module={module_api_name}",
  GET_ALL_USERS: "users",
  ADD_TAG: "{module_api_name}/{record_id}/actions/add_tags?tag_names=",
};
// End ZohoCRM

// Start DRIP
export const DRIP_AUTH_URLS = {
  CLIENT_ID: "MKKlHgGWlNouGPEahuYoZtDAlx2rSAs-f2miQ8QGtM4",
  CLIENT_SECRET: "LX8Sr8QNA-ecX0AvCP3qnOFRE51m7ap69xFJwwTvpX8",
  APP_NAME: "FormSync",
  AUTH_URL:
    "https://www.getdrip.com/oauth/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  BASE_URL: "https://api.getdrip.com/v2/",
  ADD_WEBHOOK: "{account}/webhooks",
  DELETE_WEBHOOK: "{account}/webhooks/{webhookId}",
  GET_ACCOUNTS: "accounts",
  GET_CAMPAIGNS: "{account_id}/campaigns",
};
// End DRIP

// Start TypeForm
export const TYPEFORM_AUTH_URLS = {
  CLIENT_ID: "FvqLznRvut53ZazbFJH3bZdMN4YdaDoCbS8vj5oMf9d1",
  CLIENT_SECRET: "akgB7MgZViT2CzT5M9Q5wVWb2CjNKrFdy7CM2xzp5rb",
  AUTH_URL:
    "https://api.typeform.com/oauth/authorize?state=xyz789&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope=accounts:read+forms:write+forms:read+responses:read+workspaces:read",
  BASE_URL: "https://api.typeform.com/",
  GET_WORKSPACES: "workspaces",
  GET_FORMS: "forms?page_size=200",
};
// End TypeForm

// Start ClickSend
export const CLICKSEND_AUTH_URLS = {
  BASE_URL: "https://rest.clicksend.com/v3/",
  SMS_SENT_WEBHOOK: "automations/sms/receipts",
  DELETE_SMS_DELIVERY_RECEIPT: "automations/sms/receipts/{receipt_rule_id}",
  GET_CONTACTS_LISTS: "lists",
  GET_RETURN_ADRESSES: "post/return-addresses",
};
// End ClickSend

// Start ConvertKit
export const CONVERTKIT_AUTH_URLS = {
  BASE_URL: "https://api.convertkit.com/v3/",
  GET_TAGS: "tags?api_secret={apiSecret}",
  GET_FORMS: "forms?api_secret={apiSecret}",
  GET_SEQUENCES: "sequences?api_secret={apiSecret}",
  CREATE_WEBHOOK: "automations/hooks",
  DELETE_WEBHOOK: "automations/hooks/{ruleId}",
};
// End ConvertKit

// Start SendInBlue
export const SENDINBLUE_AUTH_URLS = {
  BASE_URL: "https://api.sendinblue.com/v3/",
  GET_ACCOUNT: "account",
  GET_LIST: "contacts/lists",
  CREATE_WEBHOOK: "webhooks",
  DELETE_WEBHOOK: "webhooks/{webhookId}",
};
// End SendInBlue

// Start QuickBooks
export const QUICKBOOKS_AUTH_URLS = {
  CLIENT_ID: "AB6jrtbFF8i6hnpPkvaw6OyieVVYgLAE0LwrAL5HitcB2jwi5J",
  CLIENT_SECRET: "8m7k7YoU29lQhrLVe1bzjLFyv3m32bVtXQI5Qz7b",
  AUTH_URL:
    "https://appcenter.intuit.com/connect/oauth2?client_id={CLIENT_ID}&response_type=code&scope=openid%20email%20com.intuit.quickbooks.accounting&redirect_uri={REDIRECT_URI}&state=security_token%3D138r5719ru3e1%26url%3D",
  ACCESS_TOKEN_URL: "https://developer.api.intuit.com/v2/oauth2/tokens/revoke",
};
// End QuickBooks

// Start Discord
export const DISCORD_AUTH_URLS = {
  CLIENT_ID: "879244488827097088",
  CLIENT_SECRET: "cx-mqKJ-vhIchdSTg10S2aa_IUHQUAuy",
  BASE_URL: "https://discord.com/api/",
  AUTH_URL: "https://discord.com/api/oauth2/authorize?client_id=879244488827097088&permissions=261993005047&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapp%2Fdashboard&response_type=code&scope=bot%20identify%20email%20guilds%20guilds.join",
  //"https://discord.com/api/oauth2/authorize?client_id=879244488827097088&permissions=261993005047&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapp%2Fdashboard&response_type=code&scope=bot%20email%20identify%20rpc.activities.write%20activities.write",  
  ACCESS_TOKEN_URL: "https://discord.com/api/oauth2/token",
  GET_CURRENT_USER: "https://discord.com/api/users/@me"
};
// End Discord

// Start Telegram
export const TELEGRAM_AUTH_URLS = {
  BASE_URL: "https://api.telegram.org/bot{token}/",
  GET_CURRENT_USER: "getMe",
  CREATE_WEBHOOK: "setWebhook?url={url}",
  DELETE_WEBHOOK: "deleteWebhook",
};
// End Telegram

// Start Mixpanel
export const MIXPANEL_AUTH_URLS = {
  BASE_URL: "https://api.mixpanel.com/"
};
// End Mixpanel

// Start GetResponse
export const GETRESPONSE_AUTH_URLS = {
  BASE_URL: "https://api.getresponse.com/v3/",
  CREATE_WEBHOOK: "accounts/callbacks",
  DELETE_WEBHOOK: "accounts/callbacks",
  GET_CAMPAIGN_LIST: "campaigns",
  GET_CONTACT_LIST: "contacts",
  GET_TAGS: "tags",
  GET_FROM_FIELDS: "from-fields"
};
// End GetResponse

// Start Calendly
export const Calendly_AUTH_URLS = {
  BASE_URL: "https://calendly.com/api/v1/",
  GET_ACCOUNT: "users/me",
  CREATE_WEBHOOK: "hooks",
  DELETE_WEBHOOK: "hooks/{id}"
};
// End Calendly


// Start DocuSign
export const DocuSign_AUTH_URLS = { 
  BASE_URL: "https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}",
  CLIENT_ID: "87327eba-f66f-4305-8085-1440542a6555",
  SECERT_KEY: "b3eb7578-20bc-4117-b98c-47dc365f8b55",
  ACCESS_TOKEN_URL: "https://account-d.docusign.com/oauth/token",
  DOCUSIGN_BASE_URL: "https://demo.docusign.net",
  GET_USER_INFO : "https://account-d.docusign.com/oauth/userinfo",
  CREATE_WEBHOOK: "https://demo.docusign.net/restapi/v2.1/accounts/{AccountID}/connect",
  DELETE_WEBHOOK: "/restapi/v2.1/accounts/{AccountID}/connect/{id}",
  GET_TEMPLATE: "/restapi/v2.1/accounts/{AccountID}/templates/",
  GET_RECIPIENT: "/restapi/v2.1/accounts/{AccountID}/templates/{templateId}/recipients"
};
// End DocuSign

// Start StoryChief
export const StoryChief_AUTH_URLS = {
  AUTH_URL:"https://app.storychief.io/oauth/authorize?client_id={CLIENT_ID}&state=LNGKa2x0mReBhWWf8QNtEdg1EU3qgKCle6hUzuZW&redirect_uri={REDIRECT_URI}&response_type=code",
  CLIENT_ID: "118",
  CLIENT_SECRET: "LNGKa2x0mReBhWWf8QNtEdg1EU3qgKCle6hUzuZW",
  BASE_URL: "https://api.storychief.io/1.0",
  USER_INFO: "/me",
  ACCESS_TOKEN_URL: "https://app.storychief.io/oauth/token",
};
// End StoryChief

// Start Swell
export const SWELL_AUTH_URLS = {
  Auth_URL: "https://client_id:client_key@api.swell.store",
  USER_INFO: "https://client_id:client_key@api.swell.store/:users",
  CREATE_WEBHOOK: "https://client_id:client_key@api.swell.store/:webhooks",
  GET_PROMOTION: "https://client_id:client_key@api.swell.store/promotions",
  DELETE_WEBHOOK: "https://client_id:client_key@api.swell.store/:webhooks/WebhookId",
  GET_COUPON: "https://client_id:client_key@api.swell.store/coupons",
  GET_CUSTOMER: "https://client_id:client_key@api.swell.store/accounts",

}
// End Swell

// Start Xero
export const XERO_AUTH_URLS = {
  Auth_URL: "https://login.xero.com/identity/connect/authorize?response_type=code&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&scope={SCOPES}&state=4324797876587654323456765432",
  CLIENT_ID: "0119DC9BA11C43A78A9F6D042CF5B634",
  SECERT_KEY: "GF1qgUJoJZixmkmOmS3mTu_GM9P0iFFe9JWoAMJtGIvyEPGH",
  SCOPES: "offline_access openid profile email accounting.transactions accounting.attachments accounting.reports.read accounting.settings accounting.contacts accounting.journals.read",
  ACCESS_TOKEN_URL: "https://identity.xero.com/connect/token",
  CONNECTION_URL: "https://api.xero.com/connections",
  GET_USER_INFO: "https://api.xero.com/api.xro/2.0/Users",
  BASE_URL: "https://api.xero.com/api.xro/2.0/",
  ORGANIZATION_GET: "Organisation",
  GROUPS_GET: "ContactGroups",
  CONTACT_GET: "Contacts",
  CURRENCY_GET: "Currencies",
  ITEM_GET: "Items",
  ACCOUNT_GET: "Accounts",
  THEME_GET: "BrandingThemes"
}
// End Xero

// Start Monday
export const MONDAY_AUTH_URLS = {
  BASE_URL: "https://api.monday.com",
  GET_USER_INFO: "?query= query {users { email mobile_phone phone account {name id }}}",
  GET_BOARDS: "?query= query { boards {id name }}",
  GET_GROUPS: "?query= query { boards (ids: {BOARD_ID}) {id name groups {id title} }}",
  GET_ITEMS: "?query= query { items {id name state }}"
}
// End Monday

// Start PipeDrive
export const PIPEDRIVE_AUTH_URLS = {
  AUTH_URL: "https://oauth.pipedrive.com/oauth/authorize?client_id={CLIENT_ID}&state=678ugf5678y676rdxcfvgh6435WTHFBXVZFAR645342QRGBDVSXVGT3E&redirect_uri={REDIRECT_URI}&response_type=code",
  CLIENT_ID: "5ca65eb482b1585d",
  SECERT_KEY: "718c04d5368d6d97fa33e72d61bcd94924604abe",
  ACCESS_TOKEN_URL: "https://oauth.pipedrive.com/oauth/token",
  BASE_URL: "https://{API}.pipedrive.com/api/v1",
  USER_INFO: "/users/me?api_token={APITOKEN}",
  CREATE_WEBHOOK: "/webhooks?api_token={APITOKEN}",
  GET_STAGES: "/stages?api_token={APITOKEN}",
  GET_USERS: "/users?api_token={APITOKEN}",
  GET_ORGANIZATIONS: "/organizations?api_token={APITOKEN}",
  GET_PERSONS: "/persons?api_token={APITOKEN}",
  GET_CURRENCY: "/currencies?api_token={APITOKEN}",
  GET_DEALS: "/deals?api_token={APITOKEN}",
  GET_TYPES: "/activityTypes?api_token={APITOKEN}",
  GET_ACTIVITY: "/activities?api_token={APITOKEN}",
  GET_LABELS: "/leadLabels?api_token={APITOKEN}"
}
// End PipeDrive


// Start Notion
export const NOTION_AUTH_URLS = {
  AUTH_URL: "https://api.notion.com/v1/oauth/authorize?owner=user&client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&state=87wdfgbv34576545654987652448458fgDRTFDFHuyrbdx2255DFGyhasdfgsDNBCSRTHHGFD&response_type=code",
  CLIENT_ID: "38602e11-314f-4148-b7af-0800c427d095",
  CLIENT_SECRET: "secret_b90RepyrioUBhsnXZiPG1PwarkYwp8YoCIiEB9GUiXD",
  ACCESS_TOKEN_URL: "https://api.notion.com/v1/oauth/token",
  BASE_URL: "https://api.notion.com",
  USER_INFO: "/v1/users/me",
  GET_PAGES: "/v1/search"
};
// End Notion

// Start SurveySparrow
export const SURVEYSPARROW_AUTH_URLS = {
  BASE_URL: "https://api.surveysparrow.com",
  USER_INFO: "/v1/contacts",
  GET_SURVEY: "/v1/surveys",
  GET_EMAIL_SHARE_TEMPLATE: "/v1/surveys/{survey_id}/shares",
  GET_NPS_EMAIL_SHARE_TEMPLATE: "/v1/nps/{survey_id}/shares"
};
// End SurveySparrow


// Start FollowUpBoss
export const FOLLOWUPBOSS_AUTH_URLS = {
  // fka_0hVqZ40hrvlH6D7KsVuao0EKb2t1HSwYKj
  BASE_URL: "https://api.followupboss.com",
  USER_INFO: "/v1/me",
  GET_PEOPLES: "/v1/people",
  GET_GROUPS: "/v1/groups",
  GET_USERS: "/v1/users",
  GET_PIPELINES: "/v1/pipelines",
  GET_PIPELINE_STAGES: "/v1/pipelines/",

};
// End FollowUpBoss


// Start LionDesk
export const LIONDESK_AUTH_URLS = {
  AUTH_URL: "https://api-v2.liondesk.com/oauth2/authorize?scope=write%2Cread&redirect_uri={REDIRECT_URI}&response_type=code&client_id={CLIENT_ID}&state=456456576FGHGty67654jertdsvfHJYTREFGHJDGFGH3456FGH45657GDF",
  CLIENT_ID: "a941ba140a6349cefb6fc12660569b3161db06f8",
  CLIENT_SECRET: "03bd27dfd83834fc2ac7277c4fb1024a026e2824",
  ACCESS_TOKEN_URL: "https://api-v2.liondesk.com//oauth2/token",
  BASE_URL: "https://api-v2.liondesk.com/",
  USER_INFO: "/me",
  GET_COMPAIGN: "/campaigns",
  GET_TAG: "/tags",
  GET_CONTACT: "/contacts",
  GET_HOTNESS: "/hotnesses",
  GET_CONTACT_SOURCE: "/contact-sources"
};
// End LionDesk


// Start BombBomb
export const BOMBBOMB_AUTH_URLS = {
//  CLIENT_ID: "8d1b3b38-cd31-7710-43b3-2276c5acda71",
 BASE_URL: "https://api.bombbomb.com/v2",
 USER_INFO: "/user",
 CREATE_WEBHOOK: "/webhook",
 DELETE_WEBHOOK: "/webhook/{WebhookId}",
 GET_EMAIL_TITLE: "/emails"
};
// End BombBomb

// GoogleContact
export const GOOGLE_CONTACT_AUTH_URLS = {
  BASE_URL: "https://people.googleapis.com/v1/",
  AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&access_type=offline&prompt=consent&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcontacts profile email&flowName=GeneralOAuthFlow&state=ERTYTUJHFGDsdfgEWRTG345678JHGDSFGsdftyukjhghfd23456ygd",
  ACCESS_TOKEN_URL: "https://oauth2.googleapis.com/token",
  USER_INFO: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
  GET_CONTACTS: "people/me/connections?personFields=names,phoneNumbers"
};
// End GoogleContact

// Start PandaDoc
export const PANDADOC_AUTH_URLS = {
   BASE_URL: "https://api.pandadoc.com",
   USER_INFO: "/public/v1/contacts/",
   CREATE_WEBHOOK: "/public/v1/webhook-subscriptions",
   DELETE_WEBHOOK: "/public/v1/webhook-subscriptions/{WebhookId}",
   GET_TEMPLATES: "/public/v1/templates",
   GET_FOLDERS: "/public/v1/documents/folders",
   GET_DOCUMENTS: "/public/v1/documents"
  };
  // End PandaDoc