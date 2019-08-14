import React from 'react';
import { Redirect } from 'react-router';
import PostStoryEditor from '../../PostStoryEditor/PostStoryEditor';

class getAddStoryPopupContent extends React.Component {
	state = {
		open: true,
		extra: true
	};

	render() {
		if (!this.state.open) return <Redirect to={'/'} />;
		if (!this.state.extra) return <Redirect to={'/create/extra'} />;

		const close = () => this.setState({ open: false });

		const addExtra = () => this.setState({ extra: false });

		return (
			<div className={'modal modal-story'}>
				<div className={'content-wrp'}>
					<PostStoryEditor type={'story'} addExtra={addExtra} />
				</div>

				<div className={'btn-wrp'}>
					<button onClick={close} className={'btn'}>
						Cancel
					</button>
					<button className={'btn'}>Save</button>
				</div>
			</div>
		);
	}
}
export default getAddStoryPopupContent;