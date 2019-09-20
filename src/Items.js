import React from 'react'
import axios from 'axios'
import InfiniteScroll from 'react-infinite-scroller'
import * as constants from './Constants'
export default class Items extends React.Component {

    state = {
        items: [], 
        selected: null,
        offset:0,
        loadMore: true
    }

    componentDidMount() {
        this.getItems()
        console.log(constants.DESCRIPTION_LABEL)
    }

    getItems () {
        let {offset , items} = this.state
        axios.get(`https://kn4f3kklu4.execute-api.eu-west-1.amazonaws.com/default/jstasks?offset=${offset}&count=10`)
        .then(response => {
            const data = response.data
            let loadMore = true
            if(data.length<10) {
                loadMore = false
            }
            this.setState({items: [...items,...data] , offset:offset+11 , loadMore })
        })
    }

 

    renderSingleItem(item) {
        
        axios.get(`https://kn4f3kklu4.execute-api.eu-west-1.amazonaws.com/default/jstasks/item?id=${item.id}`)
        .then(response => {
            const data = response.data
            this.setState({selected: data})
        })

       
    }

    render() {
        const { items, selected } = this.state
        return(
            items ?
            <div style={styles.mainContainer}>
                <div style={styles.itemsList} ref={(ref) => this.scrollParentRef = ref} >
                <InfiniteScroll
                        pageStart={0}
                        loadMore={() => this.getItems()}
                        hasMore={this.state.loadMore}
                        threshold={100}
                        initialLoad={true}
                        loader={<h4 style={{ color: 'Black' }} key={0}>{constants.LOAD_MORE_LABEL}</h4>}
                        useWindow={false}
                        getScrollParent={() => this.scrollParentRef}
                    >
                    {items.map(item => {
                        return(
                            <div style={styles.itemRow} onClick={() => this.renderSingleItem(item)} >
                                <img src={item.thumb} alt="thumb" style={styles.itemThumb} />    
                                <div style={{flexDirection:'column'}}>
                                    <p style={{fontWeight:'bold'}}>{constants.ID_LABEL}: <span style={{fontWeight:'normal'}}>{item.id}</span></p>
                                    <p style={{fontWeight:'bold'}}>{constants.TITLE_LABEL}: <span style={{fontWeight:'normal'}}>{item.title}</span></p>
                                </div>
                            </div>
                        )
                    })}
                    </InfiniteScroll>
                </div> 
                <div >
                    {selected ? 
                        <div  style={styles.selectedItem}>
                            <img src={selected.picture} alt="" style={styles.itemPicture}  />
                            <div>
                                <p style={{fontWeight:'bold'}}>{constants.ID_LABEL}: <span style={{fontWeight:'normal'}}>{selected.id} </span></p>
                            </div>
                            <div>
                            <p style={{fontWeight:'bold'}}>{constants.TITLE_LABEL}: <span style={{fontWeight:'normal'}}>{selected.title} </span>   </p>
                            </div>
                            <div>
                                <p style={{fontWeight:'bold'}}>{constants.DESCRIPTION_LABEL}: <span style={{fontWeight:'normal'}}>{selected.desc}</span></p>
                            </div>
                        </div>
                        :
                        <div style={{textAlign:'center'}} >
                           <p > {constants.SELECT_ITEM_MESSAGE}</p>
                        </div>
                    }
                </div>
            </div>
            : <div><p>{constants.NO_ITEMS_MESSAGE}</p></div>
        )
    }
}

const styles = {
    "mainContainer": {
        borderStyle: 'solid',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#ffd',
        borderRadius: 5,
        borderWidth: 1,
        height:'100vh',
        borderColor: '#000000',
    },
    "itemsList": {
        overflowY: 'scroll',
        height:'100%', 
        width:'25%'
    },
    "itemRow": {
        borderStyle: 'solid',
        display: 'flex',
        alignItems: 'center',
        flex:1,
        flexDirection: 'row',
        backgroundColor: '#fee',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#000000',

    },
    "selectedItem": {
        flex: 1,
        flexDirection: 'column', 
        height:'100%', 
        justifyContent:'center', 
        alignItems: 'center',
        padding: '20px',
    },
    "itemThumb": {
        width: '100px',
        height: '100%',
        padding:'5px'
    }, 
    "itemPicture": {
        width: '80%',
        height: '300px',
    }
};