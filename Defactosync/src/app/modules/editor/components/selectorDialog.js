import React from 'react';
import { Modal } from 'reactstrap';
import NodeSelector from './nodeSelector';

class SelectorDialog extends React.Component {
  
  render() {
    const { open, onCloseDialog, nodeIndex, echoId } = this.props;

    return (
      <Modal className="node-selector-modal" toggle={onCloseDialog} isOpen={open} onBackdropClick={() => onCloseDialog} onEscapeKeyDown={() => onCloseDialog}>
        <NodeSelector type="action" echoId={echoId} nodeIndex={nodeIndex} />
      </Modal>
    );
  }
}

export default SelectorDialog;
