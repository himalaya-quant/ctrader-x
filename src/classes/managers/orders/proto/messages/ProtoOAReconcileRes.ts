import { BaseProto } from '../../../../../models/proto/base-proto';
import { ProtoOAOrder } from '../models/ProtoOAOrder';
import { ProtoOAPosition } from '../models/ProtoOAPosition';

export class ProtoOAReconcileRes extends BaseProto {
    /**
     * The list of trader's account open positions.
     */
    position: ProtoOAPosition[];

    /**
     * The list of trader's account pending orders.
     */
    order: ProtoOAOrder[];
}
