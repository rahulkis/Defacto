export const API_BASE_URL =
  "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev";

export const SEND_EMAIL_URL =
  "https://l4vs7srzr7.execute-api.sa-east-1.amazonaws.com/dev/sendemailfromlambda";

export const APP_IMAGE_URL = "https://defacto-sync.s3-sa-east-1.amazonaws.com/";

export const MEDIA_BASE_PATH = "https://s3.amazonaws.com/medifellow/";
export const API_KEY = "AIzaSyBY5bX_bO2rDLnF3NKDk6IKY6WYYWCHJ6M";
export const DEFAULT_PROFILE_PIC = "user_profiles/default_user.png";

export const AUTH_URLS = {
  CHECK_EMAIL_EXIST: "/syncemailexit/",
  USER_SIGNUP: "/syncadduser",
  USER_SIGNIN: "/syncuserlogin",
  VERIFY_EMAIL: "/syncuserverification",
};

export const PROFILE_URLS = {
  PROFILE_BY_ID: "/syncgetprofilebyid/",
  UPDATE_PROFILE_INFO: "/syncupdateprofileinfo",
  UPDATE_PROFILE_PASSWORD: "/syncupdatepassword",
};

export const APPS_LIST_URL = "/syncgetapps";
export const TRIGGERS_LIST_URL = "/syncgettriggersbyappid/";
export const ACTIONS_LIST_URL = "/syncgetactionbyid/";

export const ECHO_URLS = {
  ADD_UPDATE_ECHO: "/sync-add-update-echoes",
  GET_ECHO_BY_ID: "/sync-get-echo-by-echoid/",
  UPDATE_ECHO_STATE: "/syncupdate-echostate",
  GET_ECHOS: "/sync-get-echoes",
  TRASH_ECHO_BY_ID: "sync-echo-trash",
  COPY_ECHO: "/sync-copy-echo-and-nodes",
  TRASH_MULTIPLE_ECHO_BY_IDS: "/sync-multiple-echoes-to-trash",
  GET_ECHOES_BY_CLITYPE_AND_CONNECTIONID:
    "/sync-get-echoes-by-clitype-and-connectionid",
  GET_ON_STATE_ECHOS: "/sync-get-echoes-task-history",
  GET_RUN_ECHOS: "/sync-get-echo-run-response/",
};

export const NODES_URLS = {
  ADD_UPDATE_NODE: "/sync-add-update-echo-node",
  GET_NODE_BY_ID: "/sync-get-node-by-id/",
  GET_NODES_BY_ECHO_ID: "/sync-get-nodes-by-echoid/",
  DELETE_NODE_BY_ID: "/sync-delete-node/",
};

export const POCKETS_URLS = {
  ADD_UPDATE_POCKET: "/sync-add-update-echo-pockets",
  GET_ALL_POCKETS: "/sync-get-echo-pockets",
  DELETE_POCKET_BY_ID: "/sync-delete-echo-pocket/",
};

export const APP_EVENTS_URLS = {
  GET_CUSTOM_FIELDS_BY_EVENT: "/sync-get-app-custom-fields",
};

export const CONNECTIONS_URLS = {
  GET_ALL_CONNECTION: "/sync-get-all-connections",
  GET_CONNNECTIONS_BY_CLI: "/sync-get-connections-by-clitype/",
  GET_CONNNECTIONS_ECHOES_BY_CLI: "/sync-get-connections-echoes-by-clitype/",
  GET_ECHOES_BY_CLI: "/sync-get-echoes-by-clitype/",
  GET_CONNECTION_BY_ID: "/sync-get-connection/",
  UPDATE_CONNECTION_NAME: "/sync-update-connection-name",
  DELETE_CONNECTION: "/sync-delete-connection-update-node-meta",
};

export const SLACK_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-webhook-response-by-nodeid",
  GET_RESPONSE: "sync-get-slack-webhook-response",
  GET_TEST_ACTION_REQUEST: "sync-slack-send-test-action-request",
  GET_ACTION_RESPONSE_BY_NODE_ID: "sync-get-slack-action-response-by-nodeid",
};

export const ACTIVECAMPAIGN_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-active-campaign-web-hook-request",
  EVENT_LIST: [
    "subscribe",
    "update",
    "subscriber_note",
    "contact_task_add",
    "unsubscribe",
    "deal_add",
    "deal_note_add",
    "deal_update",
    "account_add",
    "account_update",
    "sent",
    "open",
    "forward",
    "list_add",
    "click",
    "bounce",
    "reply",
  ],
  SOURCE_LIST: ["public", "admin", "api", "system"],
  GET_RESPONSE: "sync-get-active-campaign-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-active-campaign-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-activecampaign-send-test-action-request",
};

export const MAILSHAKE_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-mailshake-webhook-request?commonInfo={commonInfo}",
  EVENTS: [
    "Clicked",
    "Opened",
    "Replied",
    "MessageSent",
    "LeadCreated",
    "LeadStatusChanged",
  ],

  GET_RESPONSE: "sync-get-mailshake-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-mailshake-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-mailshake-action-send-test-request",
};

export const KEAP_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-keapinfusionsoft-web-hook-request?commonInfo={commonInfo}",
  EVENTS: [
    "task.add",
    "invoice.add",
    "contact.add",
    "contact.edit",
    "invoice.payment.add",
  ],
  GET_RESPONSE: "sync-get-keap-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-keap-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-keap-action-send-test-request",
};

export const SENDINBLUE_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-sendinblue-webhook-request?commonInfo={commonInfo}",
  EVENTS: ["contactUpdated", "listAddition"],
  GET_RESPONSE: "sync-get-sendinblue-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-sendinblue-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-sendinblue-action-send-test-request",
};

export const TELEGRAM_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-telegram-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-telegram-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-telegram-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-telegram-action-send-test-request",
};

export const MIXPANEL_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-mixpanel-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-mixpanel-action-send-test-request",
};

export const CUSTOMERIO_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-customerio-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-customerio-action-send-test-request",
};

export const ZOHOCRM_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-zoho-web-hook-request?commonInfo={commonInfo}",
  EVENTS: [
    "Leads.create",
    "Leads.edit",
    "Contacts.create",
    "Contacts.edit",
    "Users.create",
    "Users.edit",
    "Accounts.create",
    "Accounts.edit",
    "Tasks.create",
    "Tasks.edit",
    "Notes.create",
    "Notes.edit",
    "Calls.create",
    "Calls.edit",
    "Campaigns.create",
    "Campaigns.edit",
    "Deals.create",
    "Deals.edit",
    "Events.create",
    "Events.edit",
  ],
  GET_RESPONSE: "sync-get-zoho-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-zoho-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-zoho-action-send-test-request",
};

export const DRIP_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-drip-web-hook-request?commonInfo={commonInfo}",
  EVENTS: [
    "subscriber.applied_tag",
    "subscriber.bounced",
    "subscriber.clicked_email",
    "subscriber.clicked_trigger_link",
    "subscriber.complained",
    "subscriber.completed_campaign",
    "subscriber.created",
    "subscriber.deleted",
    "subscriber.opened_email",
    "subscriber.performed_custom_event",
    "subscriber.removed_from_campaign",
    "subscriber.removed_tag",
    "subscriber.subscribed_to_campaign",
    "subscriber.unsubscribed_all",
    "subscriber.unsubscribed_from_campaign",
    "subscriber.updated_custom_field",
    "subscriber.updated_time_zone",
    "subscriber.visited_page",
  ],
  GET_RESPONSE: "sync-get-drip-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-drip-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-drip-action-send-test-request",
};

export const MAILERLITE_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-mailerlite-webhook-request",
  EVENTS: [
    "subscriber.create",
    "subscriber.update",
    "subscriber.unsubscribe",
    "subscriber.remove_from_group",
    "subscriber.added_through_webform",
    "subscriber.bounced",
    "subscriber.complaint",
    "subscriber.automation_triggered",
    "subscriber.automation_complete",
    "campaign.sent",
    "subscriber.add_to_group",
  ],
  GET_RESPONSE: "sync-get-mailerlite-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-mailerlite-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-mailerlite-action-send-test-request",
};

export const CAMPAIGN_MONITOR_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-campaignmonitor-webhook-request?commonInfo={commonInfo}",
  EVENTS: ["Subscribe", "Deactivate", "Update"],
  GET_RESPONSE: "sync-get-campaignmonitor-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-campaignmonitor-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-campaignmonitor-action-send-test-request",
};

export const GOTOWEBINAR_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-gotowebinar-webhook-request?commonInfo={commonInfo}",
  EVENTS: ["webinar.created", "registrant.added"],
  GET_RESPONSE: "sync-get-gotowebinar-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-gotowebinar-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-gotowebinar-action-send-test-request",
};

export const TRELLO_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-trello-web-hook-request",
  GET_RESPONSE: "sync-get-trello-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-trello-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-trello-action-send-test-request",
};

export const GMAIL_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-gmail-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-gmail-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-gmail-action-send-test-request",
};

export const GOOGLEDRIVE_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-googledrive-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-googledrive-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-googledrive-action-send-test-request",
};

export const GOOGLE_CALENDER_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-googlecalendar-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-googlecalendar-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-googlecalendar-action-send-test-request",
};

export const ZENDESK_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-zendesk-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-zendesk-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-zendesk-action-send-test-request",
};

export const FRESHDESK_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-freshdesk-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-freshdesk-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-freshdesk-action-send-test-request",
};

export const INTERCOM_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-intercom-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-intercom-action-response-by-node-id",
  GET_TEST_ACTION_REQUEST: "sync-intercom-action-send-test-request",
};

export const MAILCHIMP_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-mailchimp-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-mailchimp-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-mailchimp-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-mailchimp-action-send-test-request",
};

export const HELPSCOUT_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-helpscout-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-helpscout-web-hook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-helpscout-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-helpscout-action-send-test-request",
};

export const CLICKSEND_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-clicksend-web-hook-request",
  GET_RESPONSE: "sync-get-clicksend-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-clicksend-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-clicksend-action-send-test-request",
};

export const CLICKUP_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-clickup-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-clickup-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-clickup-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-clickup-action-send-test-request"
};

export const TYPEFORM_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-typeform-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-typeform-action-send-test-request"
};


export const GETRESPONSE_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-get-response-app-web-hook-request",
  GET_RESPONSE: "sync-get-getresponse-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-getresponse-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-getresponse-action-send-test-request"
};

export const CONVERTKIT_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST:
    "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-convertkit-webhook-request?commonInfo={commonInfo}",
  EVENTS: ["purchase.purchase_create", "subscriber.subscriber_unsubscribe"],
  GET_RESPONSE: "sync-get-convertkit-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-convertkit-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-convertkit-action-send-test-request",
};

export const CALENDLY_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-calendly-webhook-request",
  EVENTS: [
    "invitee.created",
    "invitee.canceled"
  ],
  GET_RESPONSE: "sync-get-calendly-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-calendly-action-response-by-nodeid",
};

export const GOOGLESHEET_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-googlesheet-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-googlesheet-action-send-test-request",
};

export const DROPBOX_WEBHOOK_URLS = {
  GET_RESPONSE: "sync-get-dropbox-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-dropbox-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-dropbox-action-send-test-request",
};

export const WEBHOOK_URLS = {
  GET_CONNECTION_INFO: "sync-get-connection-by-clitype-and-memberid",
  UPDATE_CONNECTION_INFO: "sync-update-connection-with-webhook-info",
};


export const DOCUSIGN_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-docusign-webhook-request",
  GET_RESPONSE: "sync-get-docusign-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-docusign-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-docusign-action-send-test-request",
  EVENTS: [
    "envelope-sent",
    "envelope-delivered",
    "envelope-completed"
  ],
 
};

export const SWELL_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-swell-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-swell-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-swell-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-swell-action-send-test-request",
  EVENT_LIST: [
    "product.created",
    "product.deleted",
    "category.created",
    "category.deleted",
    "category.product.added",
    "category.product.removed",
    "promotion.created",
    "promotion.deleted",
    "coupon.created",
    "coupon.deleted"    
  ]
}

export const XERO_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-xero-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-xero-action-send-test-request"
}

export const STORYCHIEF_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-storychief-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-storychief-action-send-test-request"
}

export const MONDAY_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-monday-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "syncmondayactionsendtestrequest"
}

export const PIPEDRIVE_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-pipedrive-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-pipedrive-action-send-test-request"
}

export const NOTION_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-notion-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-notion-action-send-test-request"
}

export const SURVEYSPARROW_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-surveysparrow-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-surveysparrow-action-send-test-request"
}

export const FOLLOWUPBOSS_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-followupboss-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-followupboss-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-followupboss-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-followupboss-action-send-test-request"
}

export const LIONDESK_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-liondesk-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-liondesk-action-send-test-request"
}

export const BOMBBOMB_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-bombbomb-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-bombbomb-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-bombbomb-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-bombbomb-action-send-test-request"
}

export const GOOGLECONTACT_WEBHOOK_URLS = {
  GET_RESPONSE_BY_NODE_ID: "sync-get-googlecontact-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-googlecontact-action-send-test-request"
}

export const PANDADOC_WEBHOOK_URLS = {
  POST_WEBHOOK_REQUEST: "https://xnr6i0z639.execute-api.sa-east-1.amazonaws.com/dev/sync-pandadoc-webhook-request?commonInfo={commonInfo}",
  GET_RESPONSE: "sync-get-pandadoc-webhook-response",
  GET_RESPONSE_BY_NODE_ID: "sync-get-pandadoc-action-response-by-nodeid",
  GET_TEST_ACTION_REQUEST: "sync-pandadoc-action-send-test-request"
}

export const IMAGE_FOLDER = {
  APP_IMAGES: "AppImages/",
};
export const EMAIL_SENDER = "surjeet@yopmail.com";
export const ENCRYPTION_KEYS = {
  CRYPTOJS_SECRETKEY: "69845lkhj21335",
};

export const AWS_BUCKET = {
  NAME: "defacto-sync",
  USERIMAGES: "UserImages",
  USERIMAGESURL: "https://defacto-sync.s3-sa-east-1.amazonaws.com/UserImages/",
};

export const REGEX_VALID = {
  EMAIL: /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
};

export const ACCESS_TOKEN_EXPIRE_TIME = "30"; // in Minutes
export const VERIFICATION_CODE_EXPIRE_TIME = "480"; // in Minutes

export const ECHO_RAN_MESSAGE =
  "When you turn your Echo on, it will run the action steps every time the trigger event occurs. This is a count of the resulting Echos that ran at least one during the date range provided.";
export const TASK_AUTOMATED_MESSAGE =
  "Whenever your Echo successfully completes an action, it counts as a task. Trigger steps do not count as tasks, but successful action steps do. You can see all the tasks your resulting Echos have attempted here.";

export const REGEX_VALID_URL = new RegExp(
  "^" +
  // protocol identifier
  "(?:(?:https?|ftp)://)" +
  // user:pass authentication
  "(?:\\S+(?::\\S*)?@)?" +
  "(?:" +
  // IP address exclusion
  // private & local networks
  "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
  "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
  "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
  // IP address dotted notation octets
  // excludes loopback network 0.0.0.0
  // excludes reserved space >= 224.0.0.0
  // excludes network & broacast addresses
  // (first & last IP address of each class)
  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
  "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
  "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
  "|" +
  // host name
  "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
  // domain name
  "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
  // TLD identifier
  "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
  // TLD may end with dot
  "\\.?" +
  ")" +
  // port number
  "(?::\\d{2,5})?" +
  // resource path
  "(?:[/?#]\\S*)?" +
  "$",
  "i"
);
