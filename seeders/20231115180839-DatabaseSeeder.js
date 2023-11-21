'use strict';

const models = require('../models');
const movie = require('../models/movie');
const { User, Movie, Genre, Rating } = models
const faker = require('@faker-js/faker').faker
const { Op } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        const users = [];
        const movies = [];
		const ratings = [];
		const genres = [];
        const usersCount = faker.number.int({min: 5, max: 15});
        const moviesCount = faker.number.int({min: 5, max: 15});
		const ratingsCount = faker.number.int({min: 10, max: usersCount * moviesCount});
		const genresCount = faker.number.int({min: 5, max: 12});

		await Promise.all(Array.from({ length: genresCount }, async () => {
			const genre = await Genre.create({
				name: faker.lorem.words({ min: 1, max: 3 })
			});
		
			genres.push(genre);
		}));

		await Promise.all(Array.from({ length: usersCount }, async () => {
			const user = await User.create({
				username: faker.internet.userName(),
				displayname: faker.person.fullName(),
				email: faker.internet.email(),
				password: 'password',
				isAdmin: false
			});
		
			users.push(user);
		}));

		await Promise.all(Array.from({ length: moviesCount }, async () => {
				const movie = await Movie.create({
				title: faker.lorem.words({min: 1, max: 5}),
				director: faker.person.fullName(),
				description: faker.lorem.sentences({min: 4, max: 10}),
				year: faker.number.int({min: 1980, max: 2023}),
				imageUrl: faker.image.urlPicsumPhotos(),
				ratingsEnabled: true
			})

			const randomGenres = faker.helpers.arrayElements(genres);
			randomGenres.forEach(randomGenre => {
				movie.addGenre(randomGenre);
			});

			movies.push(movie)
		}));

		await Promise.all(Array.from({ length: ratingsCount }, async () => {
			const user = faker.helpers.arrayElement(users);
			const movie = faker.helpers.arrayElement(movies);

			if(ratings.every(rating => rating.UserId != user.id && rating.MovieId != movie.id)) {
				const rating = await Rating.create({
					rating: faker.number.int({min: 1, max: 4}),
					comment: faker.lorem.sentences({min: 1, max: 3}),
					UserId: user.id,
					MovieId: movie.id  
				})

				ratings.push(rating);
			} else {
				length++;
			}
		}));
	},

    async down (queryInterface, Sequelize) {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
    }
};
