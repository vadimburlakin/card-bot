/**
 * APIs for applicant profile
 * @module core/profile
 */

const Joi = require('joi');
// const debug = require('debug')('cardbot:profile');

/**
 * Describes applicant profile. Can load profile from a string or a JavaScript
 * object. Provides API for getting profile fields, validating their values,
 * and restricts the profile from being updated (e.g. makes profile immutable).
 */
class Profile {

  /**
   * Factory
   * @param  {mixed} _profile JSON encoded string or object
   * @return {Profile}
   */
  static create(_profile) {
    let profile;

    if (typeof _profile === 'string') {
      try {
        // debug('loading profile from json string');
        profile = JSON.parse(_profile);
      } catch (e) {
        // debug(`load error: ${e.message}`);
        throw new Profile.FormatError('JSON parsing failed');
      }
    } else if (typeof _profile === 'object' && _profile !== null) {
      // debug('loading profile as a js object');
      profile = _profile;
    } else {
      // debug('weird argument to Profile.create:');
      // debug(_profile);
      throw new Profile.TypeError('Expected either a JSON encoded string or an object');
    }

    let instance = new Profile;
    instance.profile = profile;

    return instance;
  }

  /**
   * Verifies that loaded profile contains the minimum set of required
   * fields, such as first name, last name and email.
   * @throws {ValidationError} If required fields are missing
   */
  validateProfile() {
    const result = Joi.validate(this.profile, Profile.SC_PROFILE_BASE, {
      allowUnknown: true,
      abortEarly: false
    });

    if (result.error) {
      let err = new Profile.ValidationError('Profile validation failed.');
      err.details = result.error.details;
      err.joiError = result.error;

      // debug('base validation of profile failed:');
      // err.details.forEach(detail => {
      //   debug(detail.message);
      // });

      throw err;
    }
  }

  /**
   * Validates specified profile fields. This function is called by the
   * card vendor class in order to make sure that profile information
   * required for that specific vendor exists in the applicant's
   * profile.
   * @param  {...String} fields List of fields to validate
   * @throws {ValidationError} If validation fails
   */
  validateFields(...fields) {
    //
  }

  /**
   * Get field <field> from the profile.
   * @param  {String} field
   * @return {mixed}
   */
  get(field) {
    return this._profile[field];
  }

  /**
   * Sets applicant's profile.
   * @param  {object} profile
   */
  set profile(profile) {
    if (this._profile != null) {
      throw new Error('Profile is already set')
    }

    this._profile = profile;
    this.validateProfile();

    Object.keys(profile).forEach(field => {
      Object.defineProperty(this, field, {
        configurable: false,
        get: () => {
          return this.get(field);
        },
        set: () => {
          throw new Error('This is a read-only field.');
        }
      });
    });
  }

}

/**
 * Thrown errors.
 */
Profile.TypeError = class TypeError extends Error {};
Profile.FormatError = class FormatError extends Error {};
Profile.ValidationError = class ValidationError extends Error {};

/**
 * Field schemas.
 */
Profile.SC_FIRST_NAME = Joi.string();
Profile.SC_LAST_NAME = Joi.string();
Profile.SC_EMAIL = Joi.string().email();

/**
 * Schema of the base profile document.
 */
Profile.SC_PROFILE_BASE = Joi.object().keys({
  first_name: Profile.SC_FIRST_NAME.required(),
  last_name: Profile.SC_LAST_NAME.required(),
  email: Profile.SC_EMAIL.required()
});

module.exports = Profile;