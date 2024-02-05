"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");


/** Related functions for users. */

class User {
    /** authenticate user with email, password.
     *
     * Returns { email, first_name, last_name, email }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static async authenticate(email, password) {
        // try to find the user first
        const result = await db.query(
            `SELECT id,
                  email,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           WHERE email = $1`,
            [email],
        );

        const user = result.rows[0];

        if (user) {
            // compare hashed password to a new hash from password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }

        throw new UnauthorizedError("Invalid email/password");
    }

    /** Register user with data.
     *
     * Returns { email, firstName, lastName }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async register(
        { email, password, firstName, lastName }) {
        const duplicateCheck = await db.query(
            `SELECT email
           FROM users
           WHERE email = $1`,
            [email],
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Duplicate email: ${email}`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
           (email,
            password,
            first_name,
            last_name)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, first_name AS "firstName", last_name AS "lastName"`,
            [
                email,
                hashedPassword,
                firstName,
                lastName
            ],
        );

        const user = result.rows[0];

        return user;
    }


    /** Create guest.
     *
     * Returns { email, firstName, lastName }
     *
     * Throws BadRequestError on duplicates.
     **/

    static async createGuest() {

        const email = await this.generateRandomEmail();
        const result = await db.query(
            `INSERT INTO users
           (email,
            password,
            first_name,
            last_name)
           VALUES ($1, $2, $3, $4)
           RETURNING id, email, first_name AS "firstName", last_name AS "lastName"`,
            [
                email,
                email,
                email,
                email
            ],
        );

        const user = result.rows[0];

        return user;
    }

    /** Given an id, return data about user.
     *
     * Returns { email, first_name, last_nam }
     * Throws NotFoundError if user not found.
     **/

    static async get(id) {
        const userRes = await db.query(
            `SELECT email,
                  first_name AS "firstName",
                  last_name AS "lastName"
           FROM users
           WHERE id = $1`,
            [id],
        );

        const user = userRes.rows[0];

        if (!user) throw new NotFoundError(`No user: ${email}`);

        return user;
    }

    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email }
     *
     * Returns { email, firstName, lastName, email }
     *
     * Throws NotFoundError if not found.
     */

    static async update(id, data) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
        }

        const { setCols, values } = sqlForPartialUpdate(
            data,
            {
                firstName: "first_name",
                lastName: "last_name",
            });
        const useridVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE id = ${useridVarIdx} 
                      RETURNING id,
                                email,
                                first_name AS "firstName",
                                last_name AS "lastName"
                                `;
        const result = await db.query(querySql, [...values, id]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${id}`);

        delete user.password;
        return user;
    }

    /** Delete given user from database; returns undefined. */

    static async remove(id) {
        let result = await db.query(
            `DELETE
           FROM users
           WHERE id = $1
           RETURNING id`,
            [id],
        );
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${id}`);
    }

    static async generateRandomEmail() {
        
        const word = Math.floor(Math.random() * 10000000);
        const domain = Math.floor(Math.random() * 10000000);

        // Combine the word and number to form an email
        return `${word}@${domain}.com`;
    }


}


module.exports = User;
