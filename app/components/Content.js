import "./Content.scss"
import React from 'react'
import List from './List'
import Dropzone from './Dropzone'
import EmptyList from './EmptyList'
import Loading from './Loading'

const Content = ({loading, results, files, visibleDropArea, onDrop, showFiles}) => {
    return (
        <section className={`content-wrapper`}>
            {loading &&
                <Loading />
            }

            {results.length > 0 &&
                <List textSearch={true} results={results} />
            }

            {visibleDropArea &&
                <Dropzone onDrop={onDrop} />
            }

            {showFiles &&
                <List droppedFiles={true} files={files} />
            }

            {/* <EmptyList /> */}
        </section>
    )
}

export default Content
