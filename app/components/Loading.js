import "./Loading.scss"
import React, {Component} from 'react'

export default class Loading extends Component {
    render() {
        const spinner = (
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" className="spinner">
              <path fill="none" d="M0 0h100v100H0z"/>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="translate(0 -30)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(30 105.98 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.08333333333333333s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(60 75.98 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.16666666666666666s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(90 65 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.25s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(120 58.66 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.3333333333333333s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(150 54.02 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.4166666666666667s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(180 50 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(-150 45.98 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.5833333333333334s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(-120 41.34 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.6666666666666666s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(-90 35 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.75s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(-60 24.02 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.8333333333333334s" repeatCount="indefinite"/>
              </rect>
              <rect width="8" height="20" x="46" y="40" rx="5" ry="5" transform="rotate(-30 -5.98 65)">
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0.9166666666666666s" repeatCount="indefinite"/>
              </rect>
            </svg>
        )

        return (
            <span className={`loading ${this.props.small ? 'small' : ''}`}>
                {spinner}
            </span>
        )
    }
}
