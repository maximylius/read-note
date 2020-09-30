import React from 'react';
import { useSelector } from 'react-redux';

function Footer() {
  const percentageEditingArea = useSelector(
    s =>
      s.panel.mdNotesPanel / 12 +
      ((s.panel.mdTextsPanel / 12) * s.panel.mdAnnotationsPanel) / 12
  );
  return (
    <div className='row static footer my-0 py-0'>
      <div className="footer-version" style={{ width: (1 - percentageEditingArea) * 100 + '%' }}>
        <span className='lead footer-version'>Alpha Version 1.1.2</span>
      </div>
      <div
        style={{ width: percentageEditingArea * 100 + '%' }}
        className='footer-shared-toolbar-container'
      >
        <div id='toolbar-container'></div>
      </div>
    </div>
  );
}

export default Footer;
