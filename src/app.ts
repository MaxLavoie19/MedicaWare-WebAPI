import { MimicServer } from './mimic-server/mimic-server';
import { ServiceModule } from './modules/service/service';
import { VisitModule } from './modules/visit/visit';
import { NoteModule } from './modules/note/note';
import { ChartEventModule } from './modules/chart-event/chart-event';
import { CvInputEventModule } from './modules/cv-input-event/cv-input-event';
import { MvInputEventModule } from './modules/mv-input-event/mv-input-event';
import { MicrobiologyModule } from './modules/microbiology/microbiology';
import { DiagnosisRelatedGroupModule } from './modules/diagnosis-related-group/diagnosis-related-group';
import { OutputModule } from './modules/output/output';
import { PrescriptionModule } from './modules/prescription/prescription';
import { LabEventModule } from './modules/lab-event/lab-event';
import { MvProcedureEventModule } from './modules/mv-procedure-event/mv-procedure-event';
import { ProcedureModule } from './modules/procedure/procedure';
import { DiagnosticModule } from './modules/diagnostic/diagnostic';
import { ProceduralTerminologyModule } from './modules/procedural-terminology/procedural-terminology';

// tslint:disable-next-line: no-unused-expression
new MimicServer([
  VisitModule, ServiceModule, NoteModule, ChartEventModule, CvInputEventModule, MvInputEventModule,
  MicrobiologyModule, DiagnosisRelatedGroupModule, OutputModule, PrescriptionModule, LabEventModule,
  MvProcedureEventModule, ProcedureModule, DiagnosticModule, ProceduralTerminologyModule,
]);
