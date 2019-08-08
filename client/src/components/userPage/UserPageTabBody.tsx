import React from 'react';
import { Switch, Route } from 'react-router-dom';
import UserProfile from './UserProfile/UserProfile';
import UserActivity from './UserActivity/UserActivity';
import UserReviews from './UserReviews/UserReviews';
import UserEvents from './UserEvents/UserEvents';
import UserSurveys from './UserSurveys/UserSurveys';
import UserTops from './UserTops/UserTops';
import UserLists from './UserLists/UserLists';
import UserWatched from './UserWatched/UserWatched';
import ProfileComponent from './ProfileComponent/ProfileComponent';
import {uploadAvatar} from './actions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

const profileInfo = {
    name: "Sofi Dub",
    male: false,
    female: true,
    location: "KIev",
    about: "Give me films",
    photoSvg:  "https://s3-alpha-sig.figma.com/img/919e/1a5a/da4f250d469108191ad9d4af68b2a639?Expires=1566172800&Signature=Kou41Z8bd8ig~9nLibgCH5gfaOc0K~9Io82-umabjJnomveXbPcqMWfD911bHy6h77reHT6ecNYFHCzmXkQNy3vEF-OzgJYgV875TI2rX~cPt1FaSJC5wCeybEfTrlBlCcdzSFn8iVcP~C8GTx-l6CIjyugGAhvr7xJ-hfAdlf~5Mll0Sy92dSKn8q7OkJdfsMvEEFVQ3rGHn8GGQZg1a60gif0VaQhuVX1gcRgwrsak~cerS1bnDvo93B1lFOIk85wlhY2hPwQrmCtI9A-qaAtbIxmzmxkRpuVUpDrX6Jd4hXpksbd7urSJ91Dg7tv9WzRZvIkLnPXflCfmPw~slw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"
}

interface IProps {
    mainPath: string,
    uploadAvatar: (FormData) => any
}

const UserPageTabs: React.SFC<IProps> = ({ mainPath, uploadAvatar }) => {
    console.log('user page', uploadAvatar)
    return (
        <div className={"user-tab-body"}>
            <Switch>
                <Route exact path={`${mainPath}`} render={() => <ProfileComponent uploadAvatar={uploadAvatar} profileInfo={profileInfo}/>} />
                <Route path={`${mainPath}/activity`} component={UserActivity} />
                <Route path={`${mainPath}/reviews`} component={UserReviews} />
                <Route path={`${mainPath}/events`} component={UserEvents} />
                <Route path={`${mainPath}/surveys`} component={UserSurveys} />
                <Route path={`${mainPath}/tops`} component={UserTops} />
                <Route path={`${mainPath}/lists`} component={UserLists} />
                <Route path={`${mainPath}/watched`} component={UserWatched} />
            </Switch>
        </div>
    );
};

const mapStateToProps = (rootState, props) => ({
    ...props
});

const actions = {
    uploadAvatar
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserPageTabs);