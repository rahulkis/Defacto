import { v4 as uuidv4 } from 'uuid';

class Echo {
  constructor(echoId, title) {
    this.id = echoId || uuidv4();
    this.title = title || 'New echo';
    this.description = null;
    this.state = 'off';
    this.shareVisibility = 'disabled';
    this.paused = true;
    this.pausedByPlan = false;
   // this.isChecked = false;
    this.lastLiveAt = null;
    this.lastPausedAt = null;
    this.hasShared = false;
    this.tasks = 0;
    this.pocketIds = [];
    this.editMode = null;
    this.isShared = false;
    this.timezone = null;
    this.isBillingExempt = false;
    this.isTrashed = false;
    this.sourceUrl = null;
    this.method = 'create';
    this.taskSuccess = 0;
    this.taskFailed = 0;
  }
}

export default Echo;
