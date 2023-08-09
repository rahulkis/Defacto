import { v4 as uuidv4 } from 'uuid';

class EchoNode {
  constructor(sortIndex, title, type, selectedCLI, eventId, echoId, isInstant, method) {
    this.sortIndex = sortIndex;
    this.id = uuidv4();
    this.title = title || '';
    this.echoId = echoId || null;
    this.selectedCLI = selectedCLI || null;
    this.selectedEvent = eventId || null;
    this.isInstant = isInstant || false;
    this.meta = {};
    this.isConnectionTested = false;
    this.isFieldsRequired = true;
    this.fields = [];
    this.typeOf = type;
    this.method = method;
    this.isCompleted = false;
  }
}

export default EchoNode;
