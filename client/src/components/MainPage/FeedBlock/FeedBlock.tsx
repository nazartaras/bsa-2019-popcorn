import React from "react";
import FeedList from "../FeedList/FeedList"
import RecommendList from "../RecommendList/RecommendList"
import "./FeedBlock.scss"
import TopList from "../TopList/TopList";

const FeedBlock =()=>{
        return <div className="feed-block">
            <FeedList posts={null}/>{/* TODO posts from api*/}
            <RecommendList />
            <TopList/>
        </div>
    
}

export default FeedBlock;