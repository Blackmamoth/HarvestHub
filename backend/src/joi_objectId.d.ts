declare module 'joi-objectid' {
    import * as Joi from 'joi';

    type ObjectId = string;

    interface ObjectIdSchema extends Joi.AnySchema {
        objectId(): this;
    }

    interface JoiObject {
        objectId(): ObjectIdSchema;
    }

    interface Extension {
        base: Joi.AnySchema;
    }

    const _default: Extension;

    export = _default;
}