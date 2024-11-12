const navbar = {
	title: "Slack Developer Tools",
	logo: {
		src: "img/logos/slack-logo.svg",
		href: "https://tools.slack.dev",
	},
	items: [
		{
			type: "dropdown",
			label: "Python",
			position: "left",
			items: [
				{
					label: "Bolt for Python",
					to: "https://tools.slack.dev/bolt-python",
					target: "_self",
				},
				{
					label: "Python Slack SDK",
					to: "https://tools.slack.dev/python-slack-sdk/",
					target: "_self",
				},
			],
		},
		{
			type: "dropdown",
			label: "JavaScript",
			position: "left",
			items: [
        {
					label: "Bolt for JavaScript",
					to: "https://tools.slack.dev/bolt-js",
					target: "_self",
				},
				{
					label: "Node Slack SDK",
					to: "https://tools.slack.dev/node-slack-sdk/",
					target: "_self",
				},
			],
		},
		{
			type: "dropdown",
			label: "Java",
			position: "left",
			items: [
				{
					label: "Bolt for Java",
					to: "https://tools.slack.dev/java-slack-sdk/guides/bolt-basics",
					target: "_self",
				},
				{
					label: "Java Slack SDK",
					to: "https://tools.slack.dev/java-slack-sdk/",
					target: "_self",
				},
			],
		},
		{
			label: "Deno Slack SDK",
			to: "https://api.slack.com/automation/quickstart",
			target: "_self",
		},
    {
			label: "Slack CLI",
			to: "https://api.slack.com/automation/quickstart",
			target: "_self",
		},
		{
			type: "dropdown",
			label: "Community",
			position: "right",
			items: [
				{
					label: "Community tools",
					to: "https://tools.slack.dev/community-tools",
					target: "_self",
				},

				{
					label: "Slack Community",
					to: "https://slackcommunity.com/",
					target: "_self",
				},
			],
		},
		{
			to: "https://api.slack.com/docs",
			label: "API Docs",
			target: "_self",
		},
		{
			type: "localeDropdown",
			position: "right",
		},
		{
			"aria-label": "GitHub Repository",
			className: "navbar-github-link",
			href: "https://github.com/slackapi",
			position: "right",
			target: "_self",
		},
	],
};

module.exports = navbar;
