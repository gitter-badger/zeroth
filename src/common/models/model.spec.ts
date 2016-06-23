import { it, describe, expect, beforeEach } from '@angular/core/testing';
import { UUID, BaseModel } from './model';
import { castDate } from '../types/date.decorator';
import * as moment from 'moment';
import { Collection } from './collection';
import { hasOne, hasMany } from '../relations';
import Moment = moment.Moment;
import { Primary } from '../types/primary.decorator';

class ChildModel extends BaseModel {

  @Primary()
  public id: string;//UUID;

  public name: string;

}
class BasicModel extends BaseModel {

  @Primary()
  public id: string;//UUID;

  public stringNoDefault: string;
  public stringWithDefault: string = 'foo';

  @castDate
  public date: Moment;

  @hasOne()
  public _child: ChildModel;

  @hasMany(ChildModel)
  public _children: Collection<ChildModel>;
}

describe('Model', () => {
  let instance: BasicModel;
  const id = 'f0d8368d-85e2-54fb-73c4-2d60374295e3';
  beforeEach(() => {

    instance = new BasicModel({id});
  });

  it('hydrates a basic model', () => {

    expect(instance.id)
      .toEqual(id);
  });

  it('retrieves the identifier with @Primary decorator', () => {
    expect(instance.getIdentifier())
      .toEqual(id);
  });

  it('retains default property values', () => {
    expect(instance.stringWithDefault)
      .toEqual('foo');
  });

  it('returns undefined for properties without default', () => {
    expect(instance.stringNoDefault)
      .toEqual(undefined);
  });

  it('casts date string to date object', () => {

    const dateModel = new BasicModel({id, date: '2016-06-13T14:22:13.312Z'});

    expect(typeof dateModel.date)
      .not
      .toBe('string');
    expect(moment.isMoment(dateModel.date))
      .toBe(true);

  });

  it('hydrates nested hasOne relations', () => {

    const nested = new BasicModel({id, _child: {name: 'childModel'}});

    expect(nested._child instanceof ChildModel)
      .toBe(true);
    expect(nested._child.name)
      .toEqual('childModel');

  });

  it('hydrates nested hasMany relations', () => {

    const nested = new BasicModel({id, _children: [{name: 'childModel'}]});

    expect(nested._children[0] instanceof ChildModel)
      .toBe(true);

    expect(nested._children[0].name)
      .toEqual('childModel');

  });

});

describe('UUID', () => {

  it('extends String', () => {

    const id = new UUID('72eed629-c4ab-4520-a987-4ea26b134d8c');

    expect(id instanceof UUID).toBe(true);
    expect(id instanceof String).toBe(true);
  });

});
