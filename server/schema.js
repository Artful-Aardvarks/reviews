const Sequelize = require("sequelize");

const createSchema = (sequelize, createTable = false) => {
	const Model = Sequelize.Model;

	class Products extends Model {}
	Products.init(
		{
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			recommend: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			review_count: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			rating: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			five_star: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			four_star: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			three_star: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			two_star: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			one_star: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "products",
			timestamps: false,
			underscored: true
		}
	);

	class Reviews extends Model {}
	Reviews.init(
		{
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			product_id: Sequelize.INTEGER,
			rating: {
				type: Sequelize.INTEGER,
				allowNull: false
			},
			created_date: {
				type: Sequelize.DATE,
				allowNull: false
			},
			summary: {
				type: Sequelize.STRING(1000)
			},
			body: {
				type: Sequelize.STRING(5000)
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
				type: Sequelize.STRING(5000)
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
			timestamps: false,
			underscored: true
		}
	);

	class Reviews_Photos extends Model {}
	Reviews_Photos.init(
		{
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			review_id: Sequelize.INTEGER,
			image_url: {
				type: Sequelize.STRING(300),
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "reviews_photos",
			timestamps: false,
			underscored: true
		}
	);

	class Characteristics extends Model {}
	Characteristics.init(
		{
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			product_id: {
				type: Sequelize.INTEGER
			},
			name: {
				type: Sequelize.STRING
			}
		},
		{
			sequelize,
			modelName: "characteristics",
			timestamps: false,
			underscored: true
		}
	);

	class Characteristic_Reviews extends Model {}
	Characteristic_Reviews.init(
		{
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			characteristic_id: Sequelize.INTEGER,
			review_id: Sequelize.INTEGER,
			value: {
				type: Sequelize.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "characteristic_reviews",
			timestamps: false,
			underscored: true
		}
	);

	Characteristic_Reviews.belongsTo(Characteristics);
	Characteristic_Reviews.belongsTo(Reviews);
	Characteristics.belongsTo(Products);
	Reviews_Photos.belongsTo(Reviews);
	Reviews.belongsTo(Products);

	createTable ? sequelize.sync({ force: true }) : null;

	return {
		Reviews,
		Reviews_Photos,
		Characteristic_Reviews,
		Characteristics,
		Products
	};
};

module.exports = createSchema;
