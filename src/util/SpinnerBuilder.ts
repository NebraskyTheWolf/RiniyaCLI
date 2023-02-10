/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   SpinnerBuilder.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alle.roy <alle.roy.student@42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/02/09 22:30:04 by alle.roy          #+#    #+#             */
/*   Updated: 2023/02/10 01:25:43 by alle.roy         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import ora, { Color, Ora } from "ora";
import {SpinnerName} from 'cli-spinners';

export default class SpinnerBuilder {
    private readonly spinner: Ora

    public constructor(text: string) {
        this.spinner = ora(text).start()
    }

    public setColor(color: Color): SpinnerBuilder {
        this.spinner.color = color
        return this
    }

    public setSpinner(spinner: SpinnerName): SpinnerBuilder {
        this.spinner.spinner = spinner
        return this
    }

    public setText(text: string): SpinnerBuilder {
        this.spinner.text = text
        return this
    }

    public fetch(): Ora {
        return this.spinner
    }
}