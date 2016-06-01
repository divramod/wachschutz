/// <reference path="../../typings.d.ts" />
import * as Hapi from "hapi";
import * as Boom from "boom";
import * as Joi from "joi";
import BaseController from './baseController';
import * as DoorModel from '../models/doorModel';
import { IDoor, IDoorRepository } from '../libs/repository/interfaces'

export default class doorController extends BaseController {
  private doorRepository: IDoorRepository;

  constructor(server: Hapi.Server, doorRepository: IDoorRepository) {
    super(server);
    this.doorRepository = doorRepository;
    console.log("door controller");
    server.app.button.watch(function (err, value) {
      if (err) {
        throw err;
      }

      if (value) {
        console.log("button pressed");
      } else {
        console.log("button released");
      }
      server.app.led.writeSync(value);
    });

    process.on('SIGINT', function () {
      server.app.led.unexport();
      server.app.button.unexport();
    });
  }

  public createDoor(): Hapi.IRouteAdditionalConfigurationOptions {
    return {
      handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        var newDoor: IDoor = request.payload;
        console.log(newDoor);

        this.doorRepository.create(newDoor).then((door) => {
          reply(door).code(201);
        }).catch((error) => {
          reply(Boom.badImplementation(error));
        });
      },
      tags: ['api', 'doors'],
      description: 'Create a door.',
      validate: {
        payload: DoorModel.createDoorModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '201': {
              'description': 'Created Door.',
              'schema': DoorModel.doorModel
            }
          }
        }
      }
    }
  }

  public updateDoor(): Hapi.IRouteAdditionalConfigurationOptions {
    return {
      handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        const id = request.params["id"]

        this.doorRepository.findById(id).then((door: IDoor) => {
          if (door) {
            var updateDoor: IDoor = request.payload;

            door.completed = updateDoor.completed;
            door.description = updateDoor.description;
            door.name = updateDoor.name;

            this.doorRepository.findByIdAndUpdate(id, door).then((updatedDoor: IDoor) => {
              reply(updatedDoor);
            }).catch((error) => {
              reply(Boom.badImplementation(error));
            });
          } else {
            reply(Boom.notFound());
          }
        }).catch((error) => {
          reply(Boom.badImplementation(error));
        });
      },
      tags: ['api', 'doors'],
      description: 'Update door by id.',
      validate: {
        params: {
          id: Joi.string().required()
        },
        payload: DoorModel.updateDoorModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Deleted Door.',
              'schema': DoorModel.doorModel
            },
            '404': {
              'description': 'Door does not exists.'
            }
          }
        }
      }
    };
  }

  public deleteDoor(): Hapi.IRouteAdditionalConfigurationOptions {
    return {
      handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        const id = request.params["id"]

        this.doorRepository.findById(id).then((door: IDoor) => {
          if (door) {
            this.doorRepository.findByIdAndDelete(id).then(() => {
              reply(door);
            }).catch((error) => {
              reply(Boom.badImplementation(error));
            });
          } else {
            reply(Boom.notFound());
          }
        }).catch((error) => {
          reply(Boom.badImplementation(error));
        });
      },
      tags: ['api', 'doors'],
      description: 'Delete door by id.',
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      response: {
        schema: DoorModel.doorModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Deleted Door.',
              'schema': DoorModel.doorModel
            },
            '404': {
              'description': 'Door does not exists.'
            }
          }
        }
      }
    };
  }

  public getDoorById(): Hapi.IRouteAdditionalConfigurationOptions {
    return {
      handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        const id = request.params["id"]
        console.log(id);
        this.doorRepository.findById(id).then((door: IDoor) => {
          if (door) {
            reply(door);
          } else {
            reply(Boom.notFound());
          }
        }).catch((error) => {
          reply(Boom.badImplementation(error));
        });
      },
      tags: ['api', 'doors'],
      description: 'Get door by id.',
      validate: {
        params: {
          id: Joi.string().required()
        }
      },
      response: {
        schema: DoorModel.doorModel
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Door founded.'
            },
            '404': {
              'description': 'Door does not exists.'
            }
          }
        }
      }
    }
  }

  public getDoors(): Hapi.IRouteAdditionalConfigurationOptions {
    return {
      handler: (request: Hapi.Request, reply: Hapi.IReply) => {
        var top = request.query.top;
        var skip = request.query.skip;

        this.doorRepository.find({}, top, skip).then((doors: Array<IDoor>) => {
          reply(doors);
        }).catch((error) => {
          reply(Boom.badImplementation(error));
        });
      },
      tags: ['api', 'doors'],
      description: 'Get all doors.',
      validate: {
        query: {
          top: Joi.number().default(5),
          skip: Joi.number().default(0)
        }
      },
      plugins: {
        'hapi-swagger': {
          responses: {
            '200': {
              'description': 'Returned Doors.',
              'schema': DoorModel.doorModel
            }
          }
        }
      }
    };
  }
}
