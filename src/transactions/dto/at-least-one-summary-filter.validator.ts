import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function AtLeastOneSummaryFilter(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneSummaryFilter',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(_: unknown, args: ValidationArguments) {
          const { year, month, startDate, endDate } = args.object as Record<
            string,
            unknown
          >;
          const hasYear = !!year;
          const hasMonth = !!month;
          const hasStartEnd = !!startDate && !!endDate;
          return hasYear || (hasYear && hasMonth) || hasStartEnd;
        },
        defaultMessage() {
          return 'Informe pelo menos um dos filtros: year, year+month ou startDate+endDate.';
        },
      },
    });
  };
}
