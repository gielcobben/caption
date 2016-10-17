// @flow
import React, { Component } from 'react'
import {Link} from 'react-router'
import {ipcRenderer} from 'electron'

import {
    ListView,
    ListViewHeader,
    ListViewFooter,
    ListViewSection,
    ListViewSectionHeader,
    ListViewRow,
    ListViewSeparator,
    Text,
    ProgressCircle
} from 'react-desktop/macOs'

export default class List extends Component {

    constructor() {
        super()
        this.state = {
            selected: null
        }
    }

    renderSectionHeader(title) {
        return (
          <ListViewSectionHeader>
            {title}
          </ListViewSectionHeader>
        );
      }

    renderItem(item, index) {
        return (
            <ListViewRow key={index} padding='10' onClick={() => {
                this.setState({ selected: index });
            }} background={this.state.selected === index ? '#007AFF' : null} onDoubleClick={() => {
                ipcRenderer.send('download', item.SubDownloadLink);
            }}>
                <Text color={this.state.selected === index ? '#FFF' : "#000"} size="14">{item.MovieReleaseName}</Text>
            </ListViewRow>
        );
    }

    render() {
        let content

        if (this.props.loading) {
            content = <ProgressCircle size={25} />
        }
        else {
            content = (
                <ListView background="#fff" width={this.props.width} height={this.props.height}>
                    {/* <ListViewHeader>
                        <Text size="11" color="#000">{this.props.results.length}</Text>
                    </ListViewHeader> */}
                    <ListViewSection >
                        {this.props.results.map((item, index) => {
                            if (index == 1) {
                                console.log(item)
                            }
                            return this.renderItem(item, index)
                        })}
                    </ListViewSection>
                    {/* <ListViewSeparator/>
                    <ListViewSection header={this.renderSectionHeader('My Section 2')}>
                        {this.renderItem('Item 4', 'This is the fourth item.')}
                        {this.renderItem('Item 5', 'This is the fifth item.')}
                        {this.renderItem('Item 6', 'This is the sixth item.')}
                    </ListViewSection> */}
                    {/* <ListViewFooter>
                        <Text size="11" color="#696969">Status</Text>
                    </ListViewFooter> */}
                </ListView>
            )
        }

        return (
            <div>
                {content}
            </div>
        )
    }

}
