import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  

  @ValidatorConstraint({ name: 'isNotInFuture', async: false })
  export class IsNotInFuture implements ValidatorConstraintInterface {
    validate(date: Date): boolean {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const submitted = new Date(date);
      submitted.setHours(0, 0, 0, 0);
  
      return submitted <= today;
    }
  
    defaultMessage(): string {
      return 'submitted_at cannot be in the future.';
    }
  }
  