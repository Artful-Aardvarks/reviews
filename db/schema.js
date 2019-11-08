const Sequelize = require("sequelize");

const createSchema = sequelize => {
	const Model = Sequelize.Model;

	class Characteristics extends Model {}
	Characteristics.init(
		{
			product_id: {
				type: Sequelize.STRING
			},
			name: {
				type: Sequelize.STRING
			}
		},
		{
			sequelize,
			modelName: "characteristics",
			timestamps: false
		}
	);

	class Characteristic_Reviews extends Model {}
	Characteristic_Reviews.init(
		{
			review_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			characteristic_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			value: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "characteristic_reviews",
			timestamps: false
		}
	);

	class Reviews_Photos extends Model {}
	Reviews_Photos.init(
		{
			review_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			image_url: {
				type: Sequelize.STRING,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "reviews_photos",
			timestamps: false
		}
	);

	class Reviews extends Model {}
	Reviews.init(
		{
			product_id: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			rating: {
				type: Sequelize.STRING,
				allowNull: false
			},
			summary: {
				type: Sequelize.STRING
			},
			body: {
				type: Sequelize.STRING
			},
			recommend: {
				type: Sequelize.BOOLEAN,
				allowNull: false
			},
			reported: {
				type: Sequelize.BOOLEAN
			},
			reviewer_name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			reviewer_email: {
				type: Sequelize.STRING
			},
			response: {
				type: Sequelize.STRING
			},
			helpfulness: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0
			}
		},
		{
			sequelize,
			modelName: "reviews",
			timestamps: false
		}
	);

	return {
		Reviews,
		Reviews_Photos,
		Characteristic_Reviews,
		Characteristics
	};
};

module.exports = createSchema;
