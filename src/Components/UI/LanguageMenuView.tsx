/* ==========================================================================
 * Language Menu View Component
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Gocalves
 * ==========================================================================
 */
import * as React from 'react';
import './LanguageMenuView.css';

interface LanguageMenuViewProps {
  onChange: any;
  selected: string;
  visible: boolean;
}

const LanguageMenuView: React.SFC<LanguageMenuViewProps> = (props) => {
  return (
    <section id="language-menu-screen" className="language-menu-screen screen">
      <header>
        <h1>Choose a Language</h1>
      </header>
      <ul>
        <li value="en-US" title="English" onClick={props.onChange}>English</li>
        <li value="es-ES" title="Spanish" onClick={props.onChange}>Spanish</li>
        <li value="fr-FR" title="French" onClick={props.onChange}>French</li>
        <li value="de-DE" title="German" onClick={props.onChange}>German</li>
        <li value="pt-PT" title="Portuguese" onClick={props.onChange}>Portuguese</li>
        <li value="it-IT" title="Italian" onClick={props.onChange}>Italian</li>
        <li value="ru-RU" title="Russian" onClick={props.onChange}>Russian</li>
        <li value="nl-NL" title="Dutch" onClick={props.onChange}>Dutch</li>
      </ul>
    </section>
  );
};

LanguageMenuView.defaultProps = {
  selected: 'en-US',
  onChange: false,
  visible: false,
};

export default LanguageMenuView;
