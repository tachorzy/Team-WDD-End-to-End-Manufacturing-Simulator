package generators

import (
	"crypto/rand"
	"errors"
	"math"
	"math/big"
)

type GeneratorParams struct {
	Frequency        float64
	LowerBound       float64
	UpperBound       float64
	Precision        float64
	Amplitude        float64
	AngularFrequency float64
	Phase            float64
	SequenceValues   *[]float64
}

type Generator interface {
	Generate(input float64, params GeneratorParams) float64
}

func NewGenerator(generatorType string) (Generator, error) {
	switch generatorType {
	case "Sine wave":
		return &SineWaveGenerator{}, nil
	case "Sawtooth":
		return &SawtoothWaveGenerator{}, nil
	case "Replay":
		return &ReplayGenerator{}, nil
	case "Random":
		return &RandomGenerator{}, nil
	default:
		return nil, errors.New("unsupported generator type")
	}
}

type SineWaveGenerator struct{}

func (g *SineWaveGenerator) Generate(input float64, params GeneratorParams) float64 {
	return params.LowerBound + params.Amplitude*math.Sin(params.AngularFrequency*input+params.Phase)
}

type SawtoothWaveGenerator struct{}

func (g *SawtoothWaveGenerator) Generate(input float64, params GeneratorParams) float64 {
	fraction := input*params.Frequency - math.Floor(input*params.Frequency)
	return params.LowerBound + (params.UpperBound-params.LowerBound)*fraction
}

type ReplayGenerator struct{}

func (g *ReplayGenerator) Generate(input float64, params GeneratorParams) float64 {
	if params.SequenceValues == nil || len(*params.SequenceValues) == 0 {
		return 0
	}
	index := int(math.Mod(input, float64(len(*params.SequenceValues))))
	return (*params.SequenceValues)[index]
}

type RandomGenerator struct{}

func (g *RandomGenerator) Generate(_ float64, params GeneratorParams) float64 {
	randFloat, _ := cryptoRandFloat64()
	return params.LowerBound + randFloat*(params.UpperBound-params.LowerBound)
}

func cryptoRandFloat64() (float64, error) {
	var b [8]byte
	_, err := rand.Read(b[:])
	if err != nil {
		return 0, err
	}
	num := big.NewInt(0).SetBytes(b[:]).Uint64()
	f := float64(num) / (1 << 64)
	return f, nil
}
