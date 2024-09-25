"use client"

import React, { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DatePickerWithPresets } from "./DatePickerWithPresets";
import dynamic from 'next/dynamic';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

const RetirementCalculator: React.FC = () => {
    const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1990, 1, 1));
    const [gender, setGender] = useState<'male' | 'female'>('female');
    const [isCalculating, setIsCalculating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    const calculateRetirementAge = () => {
        return gender === 'male' ? 63 : 55;
    }

    const retirementAge = calculateRetirementAge();
    const currentYear = new Date().getFullYear();
    const birthYear = birthDate ? birthDate.getFullYear() : currentYear;
    const yearsUntilRetirement = (birthYear + retirementAge) - currentYear;

    const handleCalculate = () => {
        setIsCalculating(true);
        setProgress(0);
        setShowResult(false);
    }

    useEffect(() => {
        if (isCalculating) {
            const timer = setInterval(() => {
                setProgress((oldProgress) => {
                    if (oldProgress === 100) {
                        clearInterval(timer);
                        setIsCalculating(false);
                        setShowResult(true);
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 6000); // 3秒后停止撒花
                        return 100;
                    }
                    return Math.min(oldProgress + 20, 100); // 加快进度
                });
            }, 200); // 缩短间隔时间

            return () => {
                clearInterval(timer);
            };
        }
    }, [isCalculating]);

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // 初始化窗口大小

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative w-[350px]">
            {showConfetti && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    <Confetti
                        width={windowSize.width}
                        height={windowSize.height}
                        recycle={false}
                        numberOfPieces={200}
                    />
                </div>
            )}
            <Card className={cn(isCalculating && "blur-sm")}>
                <CardHeader>
                    <CardTitle>退休年龄计算器</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">出生日期</Label>
                            <DatePickerWithPresets
                            date={birthDate}
                            setDate={(date) => setBirthDate(date)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="gender">性别</Label>
                            <Select value={gender} onValueChange={(value) => setGender(value as 'male' | 'female')}>
                                <SelectTrigger id="gender">
                                    <SelectValue placeholder="选择性别" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">男</SelectItem>
                                    <SelectItem value="female">女</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="pt-4">
                            <h3 className="text-lg font-semibold">退休信息</h3>
                            <p className="text-sm text-gray-500">根据当前政策计算</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium">预计退休年龄</p>
                                <p className="text-2xl font-bold">{retirementAge} 岁</p>
                            </div>
                            {showResult && (
                                <div>
                                    <p className="text-sm font-medium">距离退休还有</p>
                                    <p className="text-2xl font-bold">{yearsUntilRetirement} 年</p>
                                </div>
                            )}
                        </div>
                        <Button className="w-full" onClick={handleCalculate}>计算</Button>
                    </div>
                </CardContent>
            </Card>
            {isCalculating && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-3/4">
                        <Progress value={progress} className="w-full" />
                        <p className="text-center mt-2">计算中...</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default RetirementCalculator;