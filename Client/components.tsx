/*
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import * as React from "react";
type Props = {
  name: string;
  type: string;
  ranked: boolean;
  uid: string;
};
export default class LobbyItem extends React.Component<Props, {}> {
  render() {
    return (
      //have to ignore as tsx does not permit custom props on div
      //@ts-ignore
      <div
        className="lobbyItem"
        inplay="false"
        name={this.props.name}
        type={this.props.type}
        ranked={this.props.ranked}
        uid={this.props.uid}
      >
      <div className="lobbyItemHeader">
        <span className="gameName">{this.props.name}</span>
        <span className="inPlay">OPEN</span>
      </div>

      <div className="lobbyItemBody">
        <span className="lobbyGameType">{this.props.type}</span>
        <span className="lobbyGamePlayers">
          Players: <span />
        </span>
      </div>
    </div>
    );
  }
}
