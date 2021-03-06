/**
 * @module common
 */
/** End Typedoc Module Declaration */
import { HasOne } from './hasOne.decorator';
import { AbstractModel } from '../model';
import { Primary } from '../types/primary.decorator';
import { ThumbModel } from './thumb.model.fixture';

export class HandModel extends AbstractModel {

  @Primary()
  public handId: string;//UUID;

  public name: string;

  @HasOne(f => ThumbModel)
  thumb: ThumbModel;

}
