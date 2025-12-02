import { randomUUID } from 'node:crypto';
import { InvalidProperty } from 'src/domain/errors/invalidProperty';

export interface IWeatherSnapshotProps {
  temperature: number;
  windSpeed: number;
  humidity: number;
  collectedAt: Date;
  createdAt?: Date;
  city?: string;
  source?: string;
}

export class WeatherSnapshot {
  private _id: string;
  private _createdAt: Date;
  protected props: IWeatherSnapshotProps;

  constructor(props: IWeatherSnapshotProps, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
    this.validate();
    this._createdAt = props.createdAt || new Date();
  }

  get id() {
    return this._id;
  }

  get createdAt() {
    return this._createdAt;
  }

  get temperature() {
    return this.props.temperature;
  }

  get windSpeed() {
    return this.props.windSpeed;
  }

  get collectedAt() {
    return this.props.collectedAt;
  }

  get city() {
    return this.props.city;
  }

  get source() {
    return this.props.source;
  }

  get humidity() {
    return this.props.humidity;
  }

  private validate() {
    if (this.props.windSpeed < 0) {
      throw new InvalidProperty('Wind speed cannot be negative!');
    }

    if (this.props.humidity < 0 || this.props.humidity > 100) {
      throw new InvalidProperty('Humidity must be between 0 and 100!');
    }

    if (this.props.collectedAt > new Date()) {
      throw new InvalidProperty('Collected at cannot be in the future!');
    }
  }

  static create(props: IWeatherSnapshotProps, id?: string) {
    const weatherSnapshot = new WeatherSnapshot({ ...props }, id);

    return weatherSnapshot;
  }
}
