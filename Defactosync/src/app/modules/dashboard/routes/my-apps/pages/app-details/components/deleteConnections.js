import { httpClient } from "appUtility/Api";
import { authenticateUser } from "appUtility/commonFunction";
import {
  AUTH_INTEGRATION,
  FRESHDESK_AUTH_URLS,
  CAMPAIGN_MONITOR_AUTH_URLS,
  ZENDESK_AUTH_URLS,
  CLICKSEND_AUTH_URLS,
  TRELLOAUTH_URLS,
  GOOGLE_DRIVE_AUTH_URLS,
  GOOGLE_CALENDAR_AUTH_URLS,
  DRIP_AUTH_URLS,
  ZOHOCRM_AUTH_URLS,
  KEAP_AUTH_URLS,
  MAILSHAKE_AUTH_URLS,
  HELP_SCOUT_AUTH_URLS,
  ACTIVECAMPAIGN_AUTH_URLS,
  Mailerlite_AUTH_URLS,
  GOTOWEBINAR_AUTH_URLS,
  MAILCHIMP_AUTH_URLS,
  GMAIL_AUTH_URLS,
  CONVERTKIT_AUTH_URLS,
  SENDINBLUE_AUTH_URLS,
  TELEGRAM_AUTH_URLS,
  GETRESPONSE_AUTH_URLS,
  CLICKUP_AUTH_URLS,
  Calendly_AUTH_URLS,
  DocuSign_AUTH_URLS,
  SWELL_AUTH_URLS,
  BOMBBOMB_AUTH_URLS,
  PANDADOC_AUTH_URLS
} from "constants/IntegrationConstant";

export const deleteClickSendWebhook = (connection) => {
  let formdata = {
    headerValue: {
      Authorization: authenticateUser(connection.email, connection.token),
    },
    APIUrl:
      CLICKSEND_AUTH_URLS.BASE_URL +
      CLICKSEND_AUTH_URLS.DELETE_SMS_DELIVERY_RECEIPT.replace(
        "{receipt_rule_id}",
        connection.webhookId
      ),
  };
  try {
    httpClient.post(AUTH_INTEGRATION.DELETE_API, formdata).then((result) => {
      if (result.status === 200) {
        console.log("deleteClickSendWebhookSuccess", result);
      }
    });
  } catch (err) {
    console.log("deleteClickSendWebhookError");
  }
};

export const deleteDripWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: authenticateUser(connection.token, "X"),
    },
    APIUrl:
      DRIP_AUTH_URLS.BASE_URL +
      DRIP_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{account}",
        connection.memberId
      ).replace("{webhookId}", connection.webhookId),
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteDripWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteDripWebhookError");
  }
};

export const deleteZohoCrmWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.tokenInfo.access_token}`,
    },
    APIUrl:
      ZOHOCRM_AUTH_URLS.BASE_URL +
      ZOHOCRM_AUTH_URLS.DELETE_WATCH.replace(
        "{channel_id}",
        connection.webhookId
      ),
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteZohoCrmWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteZohoCrmWebhookError");
  }
};

export const deleteKeapWebhook = async (connection) => {
  const hooks = connection.webhookId.split(",");
  hooks.map(async (hook) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
        Accept: "application/json",
      },
      APIUrl:
        KEAP_AUTH_URLS.BASE_URL +
        KEAP_AUTH_URLS.DELETE_WEBHOOK.replace("{id}", hook),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.DELETE_API, formdata)
        .then((result) => {
          console.log("deleteKeapWebhookSuccess");
        });
    } catch (err) {
      console.log("deleteKeapWebhookError");
    }
  });
};

export const deleteMailerShakeWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: authenticateUser(connection.token, ""),
    },
    APIUrl: MAILSHAKE_AUTH_URLS.BASE_URL + MAILSHAKE_AUTH_URLS.DELETE_WEBHOOK,
    bodyInfo: {
      targetUrl: connection.webhookId,
    },
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.POST_API, formdata)
      .then((result) => {
        console.log("deleteMailerShakeWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteMailerShakeWebhookError");
  }
};

export const deleteHelpScoutWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${connection.tokenInfo.access_token}`,
    },
    APIUrl: HELP_SCOUT_AUTH_URLS.DELETE_WEBHOOK.replace(
      "{webHookId}",
      connection.webhookId
    ),
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteHelpScoutWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteHelpScoutWebhookError");
  }
};

export const deleteTrelloWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "Content-Type": "application/json",
    },
    APIUrl: TRELLOAUTH_URLS.DELETE_WEBHOOK.replace(
      "{webhookId}",
      connection.webhookId
    )
      .replace("{yourAPIKey}", TRELLOAUTH_URLS.API_KEY)
      .replace("{yourAPIToken}", connection.token),
  };
  console.log("formdata", formdata);
  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteTrelloWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteTrelloWebhookError");
  }
};

export const deleteGoogleDriveWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.tokenInfo.access_token}`,
    },
    APIUrl: GOOGLE_DRIVE_AUTH_URLS.STOP_WATCH,
    bodyInfo: {
      resourceId: connection.webhookToken,
      id: connection.webhookId,
    },
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.POST_API, formdata)
      .then((result) => {
        console.log("deleteGoogleDriveWebhookSucess", result);
      });
  } catch (err) {
    console.log("deleteGoogleDriveWebhookError");
  }
};

export const deleteGoogleCalendarWebhook = (connection) => {
  let webhookResourceId = connection.webhookToken.split(",");
  let ids = connection.webhookId.split(",");

  ids.forEach((value, i) => {
    let formdata = {
      headerValue: {
        Authorization: `Bearer ${connection.tokenInfo.access_token}`,
      },
      APIUrl: GOOGLE_CALENDAR_AUTH_URLS.STOP_WATCH,
      bodyInfo: {
        resourceId: webhookResourceId[i],
        id: ids[i],
      },
    };
    try {
      httpClient.post(AUTH_INTEGRATION.POST_API, formdata).then((result) => {
        console.log("deleteGoogleCalendarWebhookSucess", result);
      });
    } catch (err) {
      console.log("deleteGoogleCalendarWebhookError");
    }
  });
};

export const deleteFreshDeskWebhook = (connection) => {
  let ids = connection.webhookId.split(",");
  let apiUrl = connection.endPoint + FRESHDESK_AUTH_URLS.DELETE_WEBHOOK;
  let ruleType = "";
  ids.forEach((value, i) => {
    if (i === 0) {
      ruleType = apiUrl.replace("{automationType}", "1");
    } else {
      ruleType = apiUrl.replace("{automationType}", "4");
    }

    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connection.token, "X"),
      },
      APIUrl: ruleType.replace("{id}", ids[i]),
    };

    try {
      httpClient.post(AUTH_INTEGRATION.DELETE_API, formdata).then((result) => {
        if (result.status === 200) {
          console.log("deleteFreshDeskWebhookSuccess", result);
        }
      });
    } catch (err) {
      console.log("deleteFreshDeskWebhookError");
    }
  });
};

export const deleteCampaignMonitorWebhook = async (connection) => {
  let clientLists = connection.webhookToken.split(",");

  clientLists.map(async (list) => {
    let formdata = {
      headerValue: {
        Authorization: authenticateUser(connection.token, "X"),
      },
      APIUrl: CAMPAIGN_MONITOR_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{listid}",
        list
      ).replace("{webhookid}", connection.webhookId),
    };

    try {
      await httpClient
        .post(AUTH_INTEGRATION.DELETE_API, formdata)
        .then((result) => {
          console.log("deleteCampaignMonitorWebhookSuccess", result);
        });
    } catch (err) {
      console.log("deleteCampaignMonitorWebhookError");
    }
  });
};

export const deleteZenDeskWebhook = async (connection) => {
  if (connection.webhookId) {
    let triggerIds = connection.webhookId.split(",");
    let authorizationKey =
      "Basic " + btoa(connection.email + "/token:" + connection.token);



    triggerIds.map(async (triggerId) => {
      let formdata = {
        headerValue: {
          Authorization: authorizationKey,
          Accept: "application/json",
        },
        APIUrl:
          connection.endPoint +
          ZENDESK_AUTH_URLS.DELETE_TRIGGER.replace("{trigger_id}", triggerId),
      };
      console.log("formdata", formdata);
      try {
        await httpClient
          .post(AUTH_INTEGRATION.DELETE_API, formdata)
          .then((result) => {
            console.log("deleteZenDeskWebhookSuccess", result);
          });
      } catch (err) {
        console.log("deleteZenDeskWebhookError");
      }
    });
  }

};

export const deleteActiveCampaignWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "Api-Token": connection.token,
      Accept: "application/json",
    },
    APIUrl:
      connection.endPoint +
      ACTIVECAMPAIGN_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{webhookId}",
        connection.webhookId
      ),
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteActiveCampaignWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteActiveCampaignWebhookError");
  }
};

export const deleteMailerLiteWebhook = async (connection) => {
  const events = connection.webhookId.split(",");

  events.map(async (event) => {
    let formdata = {
      headerValue: {
        "X-MailerLite-ApiKey": connection.token,
        Accept: "application/json",
      },
      APIUrl: Mailerlite_AUTH_URLS.DELETE_WEBHOOK.replace("{webhookId}", event),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.DELETE_API, formdata)
        .then((result) => {
          console.log("deleteMailerLiteWebhookSuccess", result);
        });
    } catch (err) {
      console.log("deleteMailerLiteWebhookError");
    }
  });
};

export const deleteGoToWebinarWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.tokenInfo.access_token}`,
    },
    APIUrl: GOTOWEBINAR_AUTH_URLS.WEBHOOK,
    bodyInfo: connection.webhookId.split(","),
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteGoToWebinarWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteGoToWebinarWebhookError");
  }
};

export const deleteMailChimpWebhook = (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.token}`,
    },
    APIUrl:
      connection.endPoint +
      MAILCHIMP_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{list_id}",
        connection.webhookToken
      ).replace("{webhook_id}", connection.webhookId),
  };
  try {
    httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then(async (result) => {
        console.log("deleteMailChimpWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteMailChimpWebhookError");
  }
};

export const deleteGmailWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.tokenInfo.access_token}`,
    },
    APIUrl: GMAIL_AUTH_URLS.STOP_WATCH,
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.POST_API, formdata)
      .then((result) => {
        console.log("deleteGmailWebhookSucess", result);
      });
  } catch (err) {
    console.log("deleteGmailWebhookError");
  }
};

export const deleteConvertKitWebhook = async (connection) => {
  const rules = connection.webhookId.split(",");
  rules.map(async (rule) => {
    let formdata = {
      headerValue: {
        "Content-Type": "application/json",
      },
      APIUrl:
        CONVERTKIT_AUTH_URLS.BASE_URL +
        CONVERTKIT_AUTH_URLS.DELETE_WEBHOOK.replace("{ruleId}", rule),
      bodyInfo: { api_secret: connection.token },
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.DELETE_API, formdata)
        .then((result) => {
          console.log("deleteConvertKitWebhookSucess", result);
        });
    } catch (err) {
      console.log("deleteConvertKitWebhookError");
    }
  });
};

export const deleteSendinBlueWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "api-key": connection.token,
      Accept: "application/json",
    },
    APIUrl:
      connection.endPoint +
      SENDINBLUE_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{webhookId}",
        connection.webhookId
      ),
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteSendinBlueWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteSendinBlueWebhookError");
  }
};

export const deleteTelegramWebhook = async (connection) => {
  let formdata = {
    APIUrl:
      connection.endPoint.replace("{token}", connection.token) +
      TELEGRAM_AUTH_URLS.DELETE_WEBHOOK,
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.POST_API, formdata)
      .then((result) => {
        console.log("deleteTelegramWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteTelegramWebhookError");
  }
};



export const deleteGetResponseWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "X-Auth-Token": `api-key ${connection.token}`,
    },
    APIUrl:
      GETRESPONSE_AUTH_URLS.BASE_URL + GETRESPONSE_AUTH_URLS.DELETE_WEBHOOK
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteGetResponseWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteGetResponseWebhookError");
  }
};

export const deleteClickUpWebhook = async (connection) => {
  const hooks = connection.webhookId.split(",");
  hooks.map(async (hook) => {
    let formdata = {
      headerValue: {
        Authorization: connection.token,
        Accept: "application/json",
      },
      APIUrl:
        CLICKUP_AUTH_URLS.BASE_URL +
        CLICKUP_AUTH_URLS.DELETE_WEBHOOK.replace("{id}", hook),
    };
    try {
      await httpClient
        .post(AUTH_INTEGRATION.DELETE_API, formdata)
        .then((result) => {
          console.log("deleteClickUpWebhookSuccess");
        });
    } catch (err) {
      console.log("deleteClickUpWebhookError");
    }
  });
};

export const deleteCalendlyWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "X-TOKEN": connection.token,
      Accept: "application/json",
    },
    APIUrl:
      connection.endPoint +
      Calendly_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{id}",
        connection.webhookId
      ),
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteCalendlyWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteCalendlyWebhookError");
  }
};

export const deleteDocuSignWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.tokenInfo.access_token}`,
    },
    APIUrl:
      DocuSign_AUTH_URLS.DOCUSIGN_BASE_URL + DocuSign_AUTH_URLS.DELETE_WEBHOOK.replace(
        "{AccountID}",connection.memberId).replace("{id}", connection.webhookId)
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteDocuSignWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteDocuSignWebhookError");
  }
}


export const deleteSwellWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      "Api-Token": connection.token,
      Accept: "application/json",
    },
    APIUrl:
    SWELL_AUTH_URLS.DELETE_WEBHOOK.replace("client_id", connection.tokenInfo.client_id).replace("client_key", connection.token).
      replace("WebhookId", connection.webhookId)
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteSwellWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteSwellWebhookError");
  }
}

export const deleteBombBombWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `Bearer ${connection.token}`,
      Accept: "application/json",
    },
    APIUrl:
    BOMBBOMB_AUTH_URLS.BASE_URL + BOMBBOMB_AUTH_URLS.DELETE_WEBHOOK.replace("{WebhookId}", connection.webhookId)
  };

  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deleteBombBombWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deleteBombBombWebhookError");
  }
}


export const deletePandaDocWebhook = async (connection) => {
  let formdata = {
    headerValue: {
      Authorization: `API-key ${connection.token}`,
      Accept: "application/json",
    },
    APIUrl:
    PANDADOC_AUTH_URLS.BASE_URL + PANDADOC_AUTH_URLS.DELETE_WEBHOOK.replace("{WebhookId}", connection.webhookId)
  };
  try {
    await httpClient
      .post(AUTH_INTEGRATION.DELETE_API, formdata)
      .then((result) => {
        console.log("deletePandaDocWebhookSuccess", result);
      });
  } catch (err) {
    console.log("deletePandaDocWebhookError");
  }
}
