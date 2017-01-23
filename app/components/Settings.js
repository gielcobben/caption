import './Settings.scss'
import React, {Component} from 'react'
import ResetButton from './ResetButton'

export default class Settings extends Component {

    /*
     * Constructor
     */
    constructor(props) {
        super(props)
        this.countStatus = this.countStatus.bind(this)
        this.handleLanguageChange = this.handleLanguageChange.bind(this)
    }

    /*
     * Handle language change
     */
    handleLanguageChange(event) {
        this.props.changeLanguage(event.target.value)
    }

    /*
     * Count Status
     */
    countStatus(file) {
        return file.status === 'done'
    }

    /*
     * Render
     */
    render() {
        const {selectedLanguage, results, files, resetList} = this.props
        const filesDone = files.filter(this.countStatus).length
        const filesLength = files.length
        let show = false

        if (results.length > 0 || files.length > 0) {
            show = true
        }

        return (
            <section className="settings">
                <label>Language:</label>
                <select value={selectedLanguage} onChange={this.handleLanguageChange}>
                    <option value='all'>ALL</option>
                    <option value='afr'>Afrikaans</option>
                    <option value='alb'>Albanian</option>
                    <option value='ara'>Arabic</option>
                    <option value='arm'>Armenian</option>
                    <option value='baq'>Basque</option>
                    <option value='bel'>Belarusian</option>
                    <option value='ben'>Bengali</option>
                    <option value='bos'>Bosnian</option>
                    <option value='bre'>Breton</option>
                    <option value='bul'>Bulgarian</option>
                    <option value='bur'>Burmese</option>
                    <option value='cat'>Catalan</option>
                    <option value='chi'>Chinese (simplified)</option>
                    <option value='zht'>Chinese (traditional)</option>
                    <option value='zhe'>Chinese bilingual</option>
                    <option value='hrv'>Croatian</option>
                    <option value='cze'>Czech</option>
                    <option value='dan'>Danish</option>
                    <option value='dut'>Dutch</option>
                    <option value='eng'>English</option>
                    <option value='epo'>Esperanto</option>
                    <option value='est'>Estonian</option>
                    <option value='fin'>Finnish</option>
                    <option value='fre'>French</option>
                    <option value='glg'>Galician</option>
                    <option value='geo'>Georgian</option>
                    <option value='ger'>German</option>
                    <option value='ell'>Greek</option>
                    <option value='heb'>Hebrew</option>
                    <option value='hin'>Hindi</option>
                    <option value='hun'>Hungarian</option>
                    <option value='ice'>Icelandic</option>
                    <option value='ind'>Indonesian</option>
                    <option value='ita'>Italian</option>
                    <option value='jpn'>Japanese</option>
                    <option value='kaz'>Kazakh</option>
                    <option value='khm'>Khmer</option>
                    <option value='kor'>Korean</option>
                    <option value='lav'>Latvian</option>
                    <option value='lit'>Lithuanian</option>
                    <option value='ltz'>Luxembourgish</option>
                    <option value='mac'>Macedonian</option>
                    <option value='may'>Malay</option>
                    <option value='mal'>Malayalam</option>
                    <option value='mni'>Manipuri</option>
                    <option value='mon'>Mongolian</option>
                    <option value='mne'>Montenegrin</option>
                    <option value='nor'>Norwegian</option>
                    <option value='oci'>Occitan</option>
                    <option value='per'>Persian</option>
                    <option value='pol'>Polish</option>
                    <option value='por'>Portuguese</option>
                    <option value='pob'>Portuguese (BR)</option>
                    <option value='rum'>Romanian</option>
                    <option value='rus'>Russian</option>
                    <option value='scc'>Serbian</option>
                    <option value='sin'>Sinhalese</option>
                    <option value='slo'>Slovak</option>
                    <option value='slv'>Slovenian</option>
                    <option value='spa'>Spanish</option>
                    <option value='swa'>Swahili</option>
                    <option value='swe'>Swedish</option>
                    <option value='syr'>Syriac</option>
                    <option value='tgl'>Tagalog</option>
                    <option value='tam'>Tamil</option>
                    <option value='tel'>Telugu</option>
                    <option value='tha'>Thai</option>
                    <option value='tur'>Turkish</option>
                    <option value='ukr'>Ukrainian</option>
                    <option value='urd'>Urdu</option>
                    <option value='vie'>Vietnamese</option>
                </select>
                {show &&
                    <div className="info">
                        <label>Results: </label>
                        {results.length > 0 &&
                            `${results.length < 10 ? `0${results.length}` : results.length}`
                        }
                        {files.length > 0 &&
                            <span>
                                {`${filesDone < 10 ? `0${filesDone}` : filesDone} / ${filesLength < 10 ? `0${filesLength}` : filesLength}`}
                                <ResetButton resetList={resetList} />
                            </span>
                        }
                    </div>
                }
            </section>
        )
    }

}
