/* ==========================================================================
 * Entry Point
 *
 * @project: React Speech App
 * @author: Andre Goncalves (andre@andregoncalves)
 * @copyright: 2018 Andre Gocalves
 * ==========================================================================
 */
import * as React from 'react';
import * as ReactDom from 'react-dom';
import Main from './Components/Main';

ReactDom.render(<Main defaultLangCode="en-US" />, document.getElementById('app'));
