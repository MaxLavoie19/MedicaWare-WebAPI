import { MimicServer } from './mimic-server/mimic-server';
import { ServiceModule } from './modules/service/service';
import { VisitModule } from './modules/visit/visit';

// tslint:disable-next-line: no-unused-expression
new MimicServer([VisitModule, ServiceModule]);
