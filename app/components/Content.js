import "./Content.scss"
import React from 'react'
import List from './List'
import Dropzone from './Dropzone'
import EmptyList from './EmptyList'
import Loading from './Loading'

const Content = ({loading, results, visibleDropArea, onDrop}) => {
    return (
        <section className={`content-wrapper`}>
            {loading &&
                <Loading />
            }

            {results.length > 0 &&
                <List />
            }

            {visibleDropArea &&
                <Dropzone onDrop={onDrop} />
            }

            <EmptyList />
        </section>
    )
}

export default Content
