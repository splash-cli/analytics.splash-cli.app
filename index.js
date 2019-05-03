const mongoose = require("mongoose");
const post = require("micro-post");
const morgan = require("micro-morgan");
const rateLimit = require("micro-ratelimit");
const User = require("./User");

require("dotenv").load();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URL, {
	useNewUrlParser: true,
});

mongoose.connection.on("connected", () => console.log("DB Connected"));

function keyGenerator(req) {
	return (
		req.headers["x-forwarded-for"] ||
		req.connection.remoteAddress ||
		req.socket.remoteAddress ||
		req.connection.socket.remoteAddress
	);
}

const main = async (req, res) => {
	const user = keyGenerator(req);

	try {
		await User.create({
			name: user,
		});
	} catch (error) {
		console.error(error);
		return 500;
	}

	return 200;
};

module.exports = morgan("dev")(
	post(
		{
			errorCode: 400,
			response: {
				message: "Only post request allowed.",
			},
			contentType: "application/json",
		},
		rateLimit(
			{
				window: 1000 * 60 * 60,
				limit: 1,
				headers: true,
			},
			main,
		),
	),
);
