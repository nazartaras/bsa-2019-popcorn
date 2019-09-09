import React from 'react';
import './StoryVotingOption.scss';

type StoryVotingOptionProps = {
	radius?: string;
	allVotesCount: number;
	storyVotingOptionInfo: {
		body: string;
		votingOptionReactions: any[];
	};
};
const calculatePercentage = (voted, allVotesCount) => {
	return Math.round((voted / allVotesCount) * 100 * 10) / 10;
};

const StoryVotingOption = ({
	storyVotingOptionInfo: { body, votingOptionReactions },
	radius,
	allVotesCount
}: StoryVotingOptionProps) => {
	const borderStyle = { borderRadius: radius };

	return (
		<div className="story-voting-option">
			<button style={borderStyle} className="story-voting-option-button">
				{body}
			</button>
			<div className="story-voting-option-percent">
				{votingOptionReactions.length}%
				{/*	calculatePercentage(voted, allVotesCount) || 0*/}
			</div>
		</div>
	);
};

export default StoryVotingOption;
