export default interface IJobTableRow {
    id: number;
    /**
     * Name of the class
     */
    _JobName: number;
    /**
     * The main stat for the class
     */
    _CoreStatusNameID: number;
    _CoreStatusNameIDParam: string;
    /**
     * The job progression number (0 = base class, 1 = first specialization, 2 = second specialization)
     */
    _JobNumber: number;
    /**
     * The base class, zero indexed (so add 1 to get the ID). Use _Class over this.
     */
    _BaseClass: number;
    /**
     * The direct parent job ID
     */
    _ParentJob: number;

    _JobIcon: number;

    _EnglishName: string;
    /**
     * The job's base class
     */
    _Class: number;

    _JobDescriptionID: number;
    /**
     * Whether or not this is a dark class. 0 = regular, 1 = dark, 2 = holy
     */
    _DarkJob: number;
    /**
     * Whether or not the class has awakening. 0 = no, 1 = yes
     */
    _AwakeningIcon: number;

    _JobMv: string;
}
